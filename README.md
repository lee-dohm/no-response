# No Response

A GitHub Action that closes Issues where the author hasn't responded to a request for more information.

## Bot Workflow

The intent of this bot is to close issues that have not received a response to a maintainer's request for more information. Many times issues will be filed without enough information to be properly investigated. This allows maintainers to label an issue as requiring more information from the original author. If the information is not received in a timely manner, the issue will be closed. If the original author comes back and gives more information, the label is removed and the issue is reopened if necessary.

### Scheduled

Once per hour, it searches for issues that are:

- Open
- Have a label named the same as the `responseRequiredLabel` value in the configuration
- The `responseRequiredLabel` was applied more than `daysUntilClose` ago

For each issue found, it:

1. If `closeComment` is not `false`, posts the contents of `closeComment`
1. Closes the issue

### `issue_comment` Event

When an `issue_comment` event is received, if all of the following are true:

- The author of the comment is the original author of the issue
- The issue has a label named the same as the `responseRequiredLabel` value in the configuration

It will:

1. Remove the `responseRequiredLabel`
1. Reopen the issue if it was closed by someone other than the original author of the issue

## License

[MIT](LICENSE.md)
