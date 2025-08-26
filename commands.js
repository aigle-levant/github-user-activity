import { octokit } from "./octokit.js";

// get user activity
export async function getUserActivity(username) {
    const userActivity = await octokit.request("GET /users/{username}/events", {
        username: username,
        per_page: 5,
    });
    if (userActivity.data.length === 0) {
        return "No recent activity found.";
    }
    return userActivity.data.map(event => {
        let message = "";
        if (event.type === "PushEvent" && event.payload.commits && event.payload.commits.length > 0) {
            message = event.payload.commits.map(commit => commit.message).join("; ");
        } else if (event.type === "IssuesEvent" && event.payload.issue) {
            message = event.payload.action + " issue: " + event.payload.issue.title;
        } else if (event.type === "PullRequestEvent" && event.payload.pull_request) {
            message = event.payload.action + " pull request: " + event.payload.pull_request.title;
        } else {
            message = event.type;
        }
        return {
            id: event.id,
            repo: event.repo ? event.repo.name : null,
            type: event.type,
            message: message,
            created_at: event.created_at
        };
    });
}

// get user repos
export async function getUserRepos(username) {
    const userRepos = await octokit.request("GET /users/{username}/repos", {
        username: username,
        per_page: 5,
    });
    if (userRepos.data.length === 0) {
        return "No recent repos found.";
    }
    return userRepos.data.map(repo => ({
        id: repo.id,
        name: repo.full_name,
        url: repo.url
    }));
}

// get recent 3 commits of user
export async function getUserCommit(username) {
    const userCommits = await octokit.request("GET /users/{username}/events", {
        username: username,
    });
    if (userCommits.data.length === 0) {
        return "No recent activity found";
    }
    const commits = userCommits.data.filter(
        (event) => event.type === "PushEvent"
    );
    if (commits.length === 0) {
        return "No recent commits found";
    }
    const fin = commits
        .slice(0, 3)
        .map((event) => {
            return event.payload.commits.map((commit) => ({
                id: commit.sha || commit.id,
                username: event.actor.login,
                message: commit.message,
                url: commit.url || `https://github.com/${event.repo.name}/commit/${commit.sha || commit.id}`,
            }));
        })
        .flat();
    return fin;
}
