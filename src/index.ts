import { Probot } from "probot";

export default function firstTimeContributorBot(app: Probot) {
  app.on(["issues.opened", "pull_request.opened"], async (context) => {
    const { payload } = context;

    // Ignore bot users
    if (payload.sender.type === "Bot") {
      return;
    }

    const username = payload.sender.login;
    const { owner, repo } = context.repo();

    // finding issue / PR number
    const issueNumber =
      "issue" in payload ? payload.issue.number : payload.pull_request.number;

    /**
     * Check whether this is the user's first interaction
     * across the Plone GitHub organization.
     */
    const searchQuery = `author:${username} org:plone`;

    const searchResult = await context.octokit.search.issuesAndPullRequests({
      q: searchQuery,
      per_page: 2,
    });

    // If the user has more than one result
    if (searchResult.data.total_count > 1) {
      return;
    }
    // Skip organization members, maintainers, core team, etc.)
    const membership = await context.octokit.orgs
      .getMembershipForUser({
        org: "plone",
        username,
      })
      .catch(() => null);

    if (membership?.data?.state === "active") {
      return;
    }

    const message = [
      `Hi @${username}! 👋`,
      ``,
      `Thanks for your interest in Plone.`,
      ``,
      `If this is your first time contributing, please take a moment to read the contribution guidelines:`,
      ``,
      `- [First-time contributors](https://6.docs.plone.org/contributing/first-time.html)`,
      `- [Things not to do](https://6.docs.plone.org/contributing/first-time.html#things-not-to-do)`,
      `- [Contributing to Plone](https://6.docs.plone.org/contributing/index.html)`,
      `- [Contribute to documentation](https://6.docs.plone.org/contributing/documentation/index.html)`,
      `- [Contributing to Volto](https://6.docs.plone.org/contributing/volto.html)`,
      ``,
      `These guidelines help keep discussions productive and welcoming for everyone.`,
      ``,
      `Thanks for helping make Plone better ❤️`,
    ].join("\n");

    await context.octokit.issues.createComment({
      owner,
      repo,
      issue_number: issueNumber,
      body: message,
    });
  });
}
