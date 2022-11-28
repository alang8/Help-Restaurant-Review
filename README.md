# Unit 3: Editable Nodes

## Setup

From the `unit3` directory, you should `cd` into either `server` or `client`
and then run the following commands:

### `yarn install`

Installs all of `MyHypermedia`'s dependencies.

### `touch .env`

Creates a .env file for you to set up.

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## Testing

### `yarn test`

Launches the test runner in the interactive watch mode.

## Additional Features

I chose to do Graph Visualization and Search as my additional features.

## Design Questions (10 pts)

The use case that I am addressing is students asking questions for a CS
course -- similar to EdStem.

The features suitable for my use case are:

- Various text headings
- Bold
- Code Snippet
- Code Block
- Bullet list
- Italic
- Strike

These features are important since students will need to ask code-related questions
for debugging purposes. Thus, the text editor must be able to support code blocks and
formatting to make code readable. Additionally, students may ask several questions at
a time so it would be important to have a bullet list for organization. Having a
strikethrough is also a nice addition to indicate what questions have been answered,
and various heading formatting to show importance of questions.

## Notable Design Choices

I choose to crop my image when resizing, which is exactly what the demo does. Students
sometimes screenshot their code so it would be nice for them to be able to crop the
screenshot to just show the case. There is a button on the left of the height and width
for resetting the image back to its original normalized dimensions, with an intuitive icon.

For the text, I chose to have a save button to save the editor content. The save
button is also a different shade of color to make it appear more clearly for the user.

## Deployed Backend URL

[https://calm-mesa-01359.herokuapp.com/](https://calm-mesa-01359.herokuapp.com/)

## Deployed Frontend URL

[https://calm-mesa-01359.web.app/](https://calm-mesa-01359.web.app/)

## Capstone / Extra Credit

I am not doing any extra credit for this assignment.

## Known Bugs

I made a Slack post regarding two bugs on November 2nd, 10:34 PM inside the #assignments channel.
I have gone to TA hours and could not get these bugs resolved.

The two bugs are as follows:

1. When I complete a link, no mark immediately shows up in the editor for the new anchor.
   How can I fix this / how important is this?

2. When I delete an anchor, the anchor successfully gets deleted from my database.
   However in the `NodeLinkMenu` , the link gets deleted but not the anchor name. I suspect this
   has to do with async and `loadAnchorToLinksMap`, but I am unsure. When I refresh the page or
   click on the anchor, the anchor title gets removed.

Additionally, I also discovered that you cannot start a link using double click or the
keyboard highlighting. Brynn made an announcement about this in Slack. Please bear this
in mind when creating a link!

## Estimated Hours Taken

20 Hours
