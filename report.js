function printReport(counts) {
  console.log("your report");
  const sortedCounts = sortCounts(counts);
  for (const count of sortedCounts) {
    console.log(`Found ${count[1]} internal links to ${count[0]}`);
  };
};

function sortCounts(counts) {
  const listOfCounts = Object.entries(counts);
  listOfCounts.sort((countA, countB) => {
    if (countA[1] === countB[1]) {
      return countA[0].localeCompare(countB[0]);
    };
    return countB[1] - countA[1];
  });
  return listOfCounts
};

export {printReport};
