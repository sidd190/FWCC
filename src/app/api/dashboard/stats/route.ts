import { NextRequest, NextResponse } from 'next/server';
import { OrgGitHubService } from '@/lib/github-org';

export async function GET(request: NextRequest) {
  try {
    const token = process.env.GITHUB_ORG_TOKEN || process.env.GITHUB_TOKEN;
    const org = process.env.GITHUB_ORG;

    // If GitHub integration is not configured, return mock data
    if (!token || !org) {
      const mockStats = {
        totalCommits: { value: '247', change: '+12%', icon: 'GitCommit', color: '#0B874F' },
        pullRequests: { value: '18', change: '+5%', icon: 'GitPullRequest', color: '#F5A623' },
        leaderboardRank: { value: '#3', change: '+2', icon: 'Trophy', color: '#E74C3C' },
        activeProjects: { value: '8', change: '+1', icon: 'Star', color: '#9B59B6' }
      };

      const mockRecentActivity = [
        {
          type: 'commit',
          message: 'Added new authentication system',
          repo: 'fosser/auth-service',
          time: '2 hours ago'
        },
        {
          type: 'pull_request',
          message: 'Implemented user dashboard features',
          repo: 'fosser/web-app',
          time: '1 day ago'
        },
        {
          type: 'event_join',
          message: 'Joined Hacktoberfest 2024',
          repo: 'fosser/events',
          time: '3 days ago'
        },
        {
          type: 'issue',
          message: 'Fixed responsive design issues',
          repo: 'fosser/ui-components',
          time: '1 week ago'
        },
        {
          type: 'commit',
          message: 'Updated API documentation',
          repo: 'fosser/api-docs',
          time: '1 week ago'
        }
      ];

      const mockGithubWeeklyStats = {
        commits: 15,
        prsMerged: 3,
        issuesClosed: 7
      };

      const response = NextResponse.json({
        success: true,
        org: 'fosser',
        stats: mockStats,
        recentActivity: mockRecentActivity,
        githubWeeklyStats: mockGithubWeeklyStats,
      });
      
      // Add cache headers for better performance
      response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
      return response;
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