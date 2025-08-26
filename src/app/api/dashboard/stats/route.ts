import { NextRequest, NextResponse } from 'next/server';
import { OrgGitHubService } from '@/lib/github-org';

export async function GET(request: NextRequest) {
  try {
    const token = process.env.GITHUB_ORG_TOKEN || process.env.GITHUB_TOKEN;
    const org = process.env.GITHUB_ORG;

    if (!token || !org) {
      return NextResponse.json({ error: 'GITHUB_ORG and GITHUB_ORG_TOKEN must be set' }, { status: 500 });
    }

    const service = new OrgGitHubService(token, org);

    const [members, repos] = await Promise.all([
      service.getAllMemberStats(),
      service.getOrgRepos(),
    ]);

    // Aggregate stats
    const totalCommits = members.reduce((s, m) => s + m.contributions.commits, 0);
    const totalPRs = members.reduce((s, m) => s + m.contributions.pullRequests, 0);

    // Leaderboard by weighted contributions
    const withPoints = members
      .map(m => ({
        ...m,
        points: (
          m.contributions.commits * 1 +
          m.contributions.pullRequests * 5 +
          m.contributions.issues * 2
        )
      }))
      .sort((a, b) => b.points - a.points);

    const rank1 = withPoints[0];
    const leaderboardRank = rank1 ? `#1 (${rank1.login})` : '#-';

    const stats = {
      totalCommits: { value: String(totalCommits), change: 'live', icon: 'GitCommit', color: '#0B874F' },
      pullRequests: { value: String(totalPRs), change: 'live', icon: 'GitPullRequest', color: '#F5A623' },
      leaderboardRank: { value: leaderboardRank, change: 'live', icon: 'Trophy', color: '#E74C3C' },
      activeProjects: { value: String(repos.length), change: 'live', icon: 'Star', color: '#9B59B6' }
    };

    // Recent activity: top 10 recently pushed repos
    const recentActivity = repos
      .slice()
      .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
      .slice(0, 10)
      .map(r => ({
        type: 'repo',
        message: `Recent push to ${r.name}`,
        repo: r.full_name,
        time: timeAgo(new Date(r.pushed_at))
      }));

    const githubWeeklyStats = null;

    return NextResponse.json({
      success: true,
      org,
      stats,
      recentActivity,
      githubWeeklyStats,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}

function timeAgo(date: Date): string {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
  return `${Math.floor(diff / 2592000)} months ago`;
} 