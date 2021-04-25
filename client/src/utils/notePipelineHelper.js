import axios from 'axios';

export const retrievePaths = async (name, namepid, baseURL) => {
  const paths = [];
  let namepidArr = namepid.split(' ');

  //goes thru the sidebar link and retrieves the path of that link by doing namepid lookups
  while (namepidArr) {
    paths.unshift(namepidArr[0]);
    const theNote = await axios.get(
      `${baseURL}/api/notes/retreivePathing/${namepidArr[1]}`,
    );
    namepidArr = theNote.data[0] ? theNote.data[0].namepid.split(' ') : '';
  }

  return {name: name, url: paths.toString().replaceAll(',', '/')};
};
