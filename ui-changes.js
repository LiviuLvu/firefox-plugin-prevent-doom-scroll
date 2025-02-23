/** HTML elements we want to find */
const tags = ["ytd-watch-next-secondary-results-renderer"];

/** Finds element in the changes array */
const findTagIn = (mutation) => {
  if (mutation.addedNodes.length > 0) {
    return Array.from(mutation.addedNodes).filter(node => {
      return tags.includes(node.tagName?.toLowerCase());
    });
  } else return [];
};

/** Apply css to found html elements */
const applyCss = (nodes) => {
  nodes.forEach((node) => {
    node.style.visibility = "hidden";
    node.style.border = "4px dotted orange";
  });
}

/** Watch for changes being made to the DOM tree */
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    let unstyledTags = findTagIn(mutation);
    if (unstyledTags.length > 0) {
      applyCss(unstyledTags);

      // Stop observing once all element are found
      unstyledTags.forEach((tag) => tags.splice(
        tags.indexOf(tag.tagName.toLowerCase()),
        1
      ));
      if (tags.length === 0) { observer.disconnect() };
    };
  });
});
observer.observe(document.body, { childList: true, subtree: true });

/** Finds element in the document */
const findTagsInDocument = () => {
  return tags.map(tag => Array.from(document.getElementsByTagName(tag))).flat();
};

// Some changes are not cought by MutationObserver. 
// Check for the presence of the elements after delay
setTimeout(() => {
  const foundTags = findTagsInDocument();
  if (foundTags.length > 0) {
    applyCss(foundTags);
  }
}, 1000);