import axios from 'axios';
//TODO: seems to be a bug where as soon as you type a character it's firing of the save code instead of waiting a few seconds.

export const retrievePaths = async (name, namepid, baseURL) => {
  const paths = [];
  let namepidArr = namepid.split(' ');

  //todo: fix the warning in the console
  while (namepidArr[1] != 0) {
    paths.unshift(namepidArr[0]);
    const theNote = await axios.get(
      `${baseURL}/api/notes/retreivePathing/${namepidArr[1]}`,
    );
    namepidArr = theNote.data[0].namepid.split(' ');
  }
  return {name: name, url: paths.toString().replaceAll(',', '/')};
};
