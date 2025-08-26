import { Octokit } from '@octokit/rest';

export interface OrgMemberStats {
  login: string;
  name?: string;
  avatar_url: string;
  html_url: string;
  contributions: {
    commits: number;
    pullRequests: number;
    issues: number;
    reviews: number;
  };
}

export interface OrgRepoSummary {
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  pushed_at: string;
  html_url: string;
}

export class OrgGitHubService {
  private octokit: Octokit;
  private org: string;

  constructor(token: string, org: string) {
    this.octokit = new Octokit({ auth: token });
    this.org = org;
  }

  async getOrgRepos(): Promise<OrgRepoSummary[]> {
    const repos: OrgRepoSummary[] = [];
    const per_page = 100;
    let page = 1;
    // paginate through repos
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { data } = await this.octokit.repos.listForOrg({ org: this.org, type: 'public', per_page, page, sort: 'updated' });
      for (const r of data) {
        repos.push({
          name: r.name,
          full_name: r.full_name,
          description: r.description,
          language: r.language,
          stargazers_count: r.stargazers_count,
          forks_count: r.forks_count,
          open_issues_count: r.open_issues_count,
          pushed_at: r.pushed_at,
          html_url: r.html_url,
        });
      }
      if (data.length < per_page) break;
      page += 1;
    }
    return repos;
  }

  async getOrgMembers(): Promise<Array<{ login: string; avatar_url: string; html_url: string }>> {
    const members: Array<{ login: string; avatar_url: string; html_url: string }> = [];
    const per_page = 100;
    let page = 1;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { data } = await this.octokit.orgs.listMembers({ org: this.org, per_page, page });
      for (const m of data) {
        members.push({ login: m.login, avatar_url: m.avatar_url, html_url: m.html_url });
      }
      if (data.length < per_page) break;
      page += 1;
    }
    return members;
  }

  async getMemberStats(login: string, repoNames?: string[]): Promise<OrgMemberStats> {
    // Aggregate across org repos: commits, PRs, issues, reviews
    // Commits per repo via listCommits with author
    const repos = repoNames || (await this.getOrgRepos()).map(r => r.name);

    let commits = 0;
    let pullRequests = 0;
    let issues = 0;
    let reviews = 0;

    // PRs authored by user across org
    const prsSearch = await this.octokit.search.issuesAndPullRequests({
      q: `org:${this.org} author:${login} is:pr`,
      per_page: 100,
    });
    pullRequests = prsSearch.data.total_count;

    // Issues authored by user across org
    const issuesSearch = await this.octokit.search.issuesAndPullRequests({
      q: `org:${this.org} author:${login} is:issue`,
      per_page: 100,
    });
    issues = issuesSearch.data.total_count;

    // Reviews by user across org
    // GitHub search doesn't directly return reviews count; approximate via commented reviews search
    // Optionally, we could iterate PRs and count reviews, but that is rate-limit heavy; set to 0 for now
    reviews = 0;

    // Commits: iterate repos with lightweight pagination and author filter
    // Keep within rate limits by sampling first N repos most recently pushed
    const limitedRepos = repos.slice(0, 25);
    for (const repo of limitedRepos) {
      try {
        const commitsResp = await this.octokit.repos.listCommits({ owner: this.org, repo, author: login, per_page: 1 });
        // total is not provided; do a heuristic by scanning last 250 commits across pages quickly
        // For accuracy, we could paginate, but we'll approximate using up to 5 pages
        let count = 0;
        let page = 1;
        const per_page = 50;
        // eslint-disable-next-line no-constant-condition
        while (page <= 5) {
          const { data } = await this.octokit.repos.listCommits({ owner: this.org, repo, author: login, per_page, page });
          count += data.length;
          if (data.length < per_page) break;
          page += 1;
        }
        commits += count;
      } catch (_e) {
        // repo may be archived/private/non-standard; skip
      }
    }

    // Basic profile for name/avatar
    let name: string | undefined = undefined;
    let avatar_url = `https://github.com/${login}.png`;
    let html_url = `https://github.com/${login}`;
    try {
      const { data } = await this.octokit.users.getByUsername({ username: login });
      name = data.name || undefined;
      avatar_url = data.avatar_url;
      html_url = data.html_url;
    } catch {}

    return {
      login,
      name,
      avatar_url,
      html_url,
      contributions: {
        commits,
        pullRequests,
        issues,
        reviews,
      },
    };
  }

  async getAllMemberStats(): Promise<OrgMemberStats[]> {
    const members = await this.getOrgMembers();
    const repos = (await this.getOrgRepos()).map(r => r.name);

    // Concurrency control
    const concurrency = 4;
    const results: OrgMemberStats[] = [];
    let idx = 0;

    const worker = async () => {
      while (idx < members.length) {
        const current = idx++;
        const m = members[current];
        try {
          const stats = await this.getMemberStats(m.login, repos);
          results.push(stats);
        } catch (e) {
          // skip on error; continue
        }
      }
    };

    await Promise.all(Array.from({ length: concurrency }).map(() => worker()));
    return results;
  }
} 