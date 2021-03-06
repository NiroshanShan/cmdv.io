var uuidCounter = 0;

module.exports = helpers = {
  generateKey: function(length) {
      // alternate vowel and consonant
      var vowels = ['a', 'e', 'i', 'o', 'u'];
      var consonants = ['b', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'w', 'y', 'z'];

      return new Array(length)
          .join('_').split('_')
          .reduce(function (word) {
            var rand;
            if (word.length % 2 === 0) {
              rand = (Math.random() * consonants.length) | 0;
              word.push(consonants[rand]);
            } else {
              rand = (Math.random() * vowels.length) | 0;
              word.push(vowels[rand]);
            }

            return word;
          }, []).join('');
  },

  // make a function call on the next event loop- for calling actions from stores while already dispatching
  callAsync: function(f, context) {
    var args = [].slice.call(arguments, 2);
    window.setTimeout(function() {
      f.apply(context, args);
    }, 0);
  },

  makeTempKey: function() {
    return `(unsaved) ${ ++uuidCounter }`;
  }
};
