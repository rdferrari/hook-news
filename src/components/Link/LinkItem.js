import React from "react";
import { Link, withRouter } from "react-router-dom";
import { getDomain } from "../../utils";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";
import FirebaseContext from "../../firebase/context";

function LinkItem({ link, index, showCount }) {
  const { firebase, user, history } = React.useContext(FirebaseContext);

  function handleVote() {
    if (!user) {
      history.pushState("login");
    } else {
      const voteRef = firebase.db.collection("links").doc(link.id);
      voteRef.get().then(doc => {
        if (doc.exists) {
          const previousVote = doc.data().votes;
          const vote = { votedBy: { id: user.uid, name: user.displayName } };
          const updatedVotes = [...previousVote, vote];
          const voteCount = updatedVotes.length;
          voteRef.update({ votes: updatedVotes, voteCount });
        }
      });
    }
  }

  function handleDeleteLink() {
    const linkRef = firebase.db.collection("links").doc(link.id);
    linkRef
      .delete()
      .then(() => {
        console.log(`Document with ID: ${link.id} deleted`);
      })
      .catch(err => {
        console.err("Error deleting document:", err);
      });
  }

  const postedByAuthUser = user && user.uid === link.postedBy.id;

  return (
    <div className="flex items-start mt2">
      <div className="flex items-center">
        {showCount && <span className="gray">{index}.</span>}
        <div className="vote-button" onClick={handleVote}>
          +
        </div>
      </div>
      <div className="ml1">
        <a
          href={link.url}
          target="_blank"
          className="black no-underline"
          rel="noopener noreferrer"
        >
          {" "}
          {link.description}
        </a>{" "}
        <span className="link">({getDomain(link.url)})</span>
        <div className="f6 lh-copy">
          {link.voteCount} votes by {link.postedBy.name}{" "}
          {distanceInWordsToNow(link.created)} {" | "}
          <Link to={`/link/${link.id}`}>
            {link.comments.length > 0
              ? `${link.comments.length} comments`
              : "discuss"}
          </Link>
          {postedByAuthUser && (
            <>
              {" | "}
              <span className="delete-button" onClick={handleDeleteLink}>
                delete
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default withRouter(LinkItem);
