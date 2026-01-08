import { Probot } from "probot";

export default (app: Probot) => {
  app.on(["issues.opened", "pull_request.opened"], async (context) => {
    // Getting the details from the event
    const payload = context.payload;
    const user = payload.sender.login;
    //const repoName = payload.repository.name;
    const issueNumber = 'issue' in payload ? payload.issue.number : payload.pull_request.number;
    const repo = context.repo();

    // Check if this is the user's first interaction across the Plone GitHub organization
    // Search for issues/PRs by this author in the 'plone' org
    const { data: searchResults } = await context.octokit.search.issuesAndPullRequests({
      q: `author:${user} org:plone`,
      per_page: 1,  // We just need the total count, not full results
    });

    // If total_count > 1, they've contributed before in any Plone repo → skip
    if (searchResults.total_count > 1) {
      return;  // Not a first-timer
    }

    // Generalized message for all Plone repos (no per-repo customization)
    let message = `please read and follow [First-time contributors](https://6.docs.plone.org/contributing/first-time.html), especially [Things not to do](https://6.docs.plone.org/contributing/first-time.html#things-not-to-do), [Contributing to Plone](https://6.docs.plone.org/contributing/index.html), [Contribute to documentation](https://6.docs.plone.org/contributing/documentation/index.html), and [Contributing to Volto](https://6.docs.plone.org/contributing/volto.html).`;

    // Prefix with greeting and thanks (make it friendly)
    message = `Hi @${user}! Thank you for your interest in Plone.\n\n` + message + `\n\nThanks for helping make Plone better!`;

    // Post the comment
    await context.octokit.issues.createComment({
      ...repo,
      issue_number: issueNumber,
      body: message,
    });
  });
};