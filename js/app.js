// https://vuejs.org/v2/guide/state-management.html#Simple-State-Management-from-Scratch
var Data_store = {
  languages: {'de': 'Deutsch', 'it': 'Italiano', 'en': 'English', 'fr': 'Français'},
}

const app = new Vue({
  el: '#app',
  data: {
    data_store: Data_store,
    language: null,
    topic: null,
    words: null,
    filter: '',
    links_only: false,
    words_ready: false,
  },
  mounted() {
    if (localStorage.wiki_cross_words_language) { 
      this.language = localStorage.wiki_cross_words_language;
    }
    if (localStorage.wiki_cross_words_filter) { 
      this.filter = localStorage.wiki_cross_words_filter;
    }
  },
  methods: {
    go: function() {
      localStorage.wiki_cross_words_language = this.language;
      this.filter = '';
      if (this.links_only) {
        url = `https://${this.language}.wikipedia.org/w/api.php?action=query&prop=links&pplimit=max&format=json&origin=*&prop=links|extracts&titles=${encodeURIComponent(this.topic)}`
      } else {
        url = `https://${this.language}.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts&redirects&titles=${encodeURIComponent(this.topic)}`
      }
      // https://en.wikipedia.org/w/api.php?format=xml&action=query&prop=extracts&titles=Stack%20Overflow&redirects=true
      // https://it.wikipedia.org/w/api.php?action=query&titles=Milano&prop=links&pllimit=max
      axios
        .get(url, {})
        .then(response => {
          const first_id = Object.keys(response.data.query.pages)[0]
          // if topic does not exist the first index in the page is -1
          if (Number(first_id) === -1) {
            return;
          }
          // remove all html tags
          if (this.links_only) {
            this.words = [];
          } else {
            var div = document.createElement("div");
            div.innerHTML = response.data.query.pages[first_id].extract;
            const umlauts = {'ä': 'ae', 'Ä': 'Ae', 'ö': 'oe', 'Ö': 'Oe', 'ü': 'ue', 'Ü': 'Ue'};
            let text = div.textContent || div.innerText || "";
            text = text.toLowerCase().replace(new RegExp(Object.keys(umlauts).join("|"),"gi"), m => umlauts[m]);
            text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const words = text.split(/\W+/).filter(x => x);
            // const words = text.split(/[^A-Za-z\u00C0-\u017F]+/).filter(x => x);
            this.words = [...new Set(words.sort())];
          }
          // console.log(this.words);
        });
    },
    show: function() {
      this.words_ready = true;
    }
  },
  computed: {
    filter_length: function() {
      // if (this.filter.match('^(\w.]+$')) {
      if (this.filter.match('^[\\w.]+$')) {
        return this.filter.length;
      }
      return '';
    },
    matching_words: function () {
      const regex = new RegExp(`^${this.filter}$`, 'i');
      return this.words.filter(w => w.match(regex) ? true : false);
    }
  }

});
