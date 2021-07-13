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

export const checkIfNoteExists = async (destination, baseURL) => {
  let pid = 0;
  for (let i = 0; i < destination.length; i++) {
    const response = await axios.get(
      `${baseURL}/api/notes/namepid/${destination[i]}/${pid}`,
    );
    !!response.data[0] && (pid = response.data[0].id);
    if (
      i === destination.length - 1 &&
      response.data[0] &&
      response.data[0].message
    ) {
      return true;
    }
  }
  return false;
};

//export const checkIfNoteHasChildren = async (id, baseURL) => {
  //const response = await axios.get(
    //`${baseURL}/api/notes/haschildren/${id}`,
  //);
  //return false;
//};
