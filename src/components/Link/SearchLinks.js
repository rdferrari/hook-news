import React from "react";
import FirebaseContext from "../../firebase/context";
import LinkItem from "./LinkItem";

function SearchLinks() {
  const { firebase } = React.useContext(FirebaseContext);
  const [filteredLinks, setFilteredLinks] = React.useState([]);
  const [links, setLinks] = React.useState([]);
  const [filter, setFilter] = React.useState("");

  React.useEffect(() => {
    getInitialLinks();
  }, []);

  function handleSearch(event) {
    event.preventDefault();
    const query = filter.toLowerCase();
    const matchedLinks = links.filter(link => {
      return (
        link.description.toLowerCase().includes(query) ||
        link.url.toLowerCase().includes(query) ||
        link.postedBy.name.toLowerCase().includes(query)
      );
    });
    setFilteredLinks(matchedLinks);
  }

  function getInitialLinks() {
    firebase.db
      .collection("links")
      .get()
      .then(snapshot => {
        const links = snapshot.docs.map(doc => {
          return { Id: doc.id, ...doc.data() };
        });
        setLinks(links);
      });
  }

  return (
    <div>
      <form onSubmit={handleSearch}>
        <div>
          Search <input onChange={event => setFilter(event.target.value)} />
          <button>Ok</button>
        </div>
      </form>
      {filteredLinks.map((filteredLink, index) => (
        <LinkItem
          key={filteredLink.id}
          showCount={false}
          link={filteredLink}
          index={index}
        />
      ))}
    </div>
  );
}

export default SearchLinks;
