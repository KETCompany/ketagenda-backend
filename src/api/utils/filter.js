const removeDuplicates = input =>
  input
    .map(val => val.toUpperCase())
    .filter((val, i) => input.indexOf(val) === i);

const removeRoomNames = input =>
  input
    .filter(type => !(/^\w{1,2}\./g).test(type));


module.exports = {
  removeDuplicates,
  removeRoomNames,
};
