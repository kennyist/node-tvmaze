/*!
    LICENSE
 */

// Imports
const url = require('url');
const axios = require('axios').default;;

// Default Vars
const BASE_URL = 'api.tvmaze.com/';
const VERSION = require('./package.json').version;
const DEFAULT_OPTIONS = {
  https: false,
  header: {
    'User-Agent': `Mozilla/5.0 (Node.js) Tvmaze/${VERSION}` 
  }
}

const Tvmaze = {
  /**
  *  Search through all shows on TVmaze in order or relevance.
  *  @param {string} string - Search input
  *  @param {Object} [options] - Url request options
  *  @return {Promise} Promise object of result data as JSON
  *  @see https://www.tvmaze.com/api#show-search
  *  @example
  *    search("Firefly").
  *      then(response => {
  *        console.log(response);
  *      })
  *      .catch(error => {
  *        console.log(error);
  *      })
  */
  search: function(string, options){
    const query = {
      q: string // Search string
    };

    return this.sendRequest(
      `search/shows`,
      Object.assign(
        {},
        options,
        {
          query: query
        }
      )
    );
  },

  /**
  *  Search with single result with more detail and supports embedding
  *  @param {string} string - Search input
  *  @param {string[]} embed - Array of embed objects
  *  @param {Object} [options] - Url request options
  *  @return {Promise} Promise object of result data as JSON
  *  @see https://www.tvmaze.com/api#show-single-search
  *  @see https://www.tvmaze.com/api#embedding
  *  @example
  *    sinlgeSearch("Firefly", ['episodes']).
  *      then(response => {
  *        console.log(response);
  *      })
  *      .catch(error => {
  *        console.log(error);
  *      })
  */
  singleSearch: function(string, embed, options){
    const query = {
      q: string,
      "embed[]": embed
    };

    if(!embed) delete query['embed[]'];

    return this.sendRequest(
      `singlesearch/shows`,
      Object.assign(
        {},
        options,
        {
          query: query
        }
      )
    );
  },

  /**
  *  Search through all people on TVmaze in order or relevance.
  *  @param {string} string - Search input
  *  @param {Object} [options] - Url request options
  *  @return {Promise} Promise object of result data as JSON
  *  @see https://www.tvmaze.com/api#people-search
  *  @example
  *    search("Stephen Colbert").
  *      then(response => {
  *        console.log(response);
  *      })
  *      .catch(error => {
  *        console.log(error);
  *      })
  */
  searchPeople: function(string, options){
    const query = {
      q: string // Search string
    };

    return this.sendRequest(
      `search/people`,
      Object.assign(
        {},
        options,
        {
          query: query
        }
      )
    );
  },

  /**
  *  Lookup a TV show using Tvdb ID, IMDB ID or Tvrage ID
  *  @private
  *  @param {string} type - ID type, values: 'thetvdb', 'imdb', 'tvrage'
  *  @param {string} id - Input ID to search
  *  @param {Object} [options] - Url request options
  *  @return {Promise} Promise object of result data as JSON
  *  @see https://www.tvmaze.com/api#show-lookup
  *  @see lookupThetvdb
  *  @see lookupImdb
  *  @see lookupTvrage
  *  @example
  *    lookup("imdb", "tt2758770").
  *      then(response => {
  *        console.log(response);
  *      })
  *      .catch(error => {
  *        console.log(error);
  *      })
  */
  lookup: function(type, id, options){
    const query = {};
    query[type] = id;

    return this.sendRequest(
      `lookup/shows`,
      Object.assign(
        {},
        options,
        {
          query: query
        }
      )
    );
  },

  /**
  *  Lookup a TV show using a TVdb ID
  *  @param {string} id - Input ID to search
  *  @param {Object} [options] - Url request options
  *  @return {Promise} Promise object of result data as JSON
  *  @see https://www.tvmaze.com/api#show-lookup
  *  @see lookup
  *  @example
  *    lookupThetvdb("270701").
  *      then(response => {
  *        console.log(response);
  *      })
  *      .catch(error => {
  *        console.log(error);
  *      })
  */
  lookupThetvdb: function(id, options){
    return(this.lookup("thetvdb", id, options));
  },

  /**
  *  Lookup a TV show using a IMDB id
  *  @param {string} id - Input ID to search
  *  @param {Object} [options] - Url request options
  *  @return {Promise} Promise object of result data as JSON
  *  @see https://www.tvmaze.com/api#show-lookup
  *  @see lookup
  *  @example
  *    lookupImdb("tt3530232").
  *      then(response => {
  *        console.log(response);
  *      })
  *      .catch(error => {
  *        console.log(error);
  *      })
  */
  lookupImdb: function(id, options){
    return(this.lookup("imdb", id, options));
  },

  /**
  *  Lookup a TV show using a TVrage id
  *  @param {string} id - Input ID to search
  *  @param {Object} [options] - Url request options
  *  @return {Promise} Promise object of result data as JSON
  *  @see https://www.tvmaze.com/api#show-lookup
  *  @see lookup
  *  @example
  *    lookupTvrage("ID").
  *      then(response => {
  *        console.log(response);
  *      })
  *      .catch(error => {
  *        console.log(error);
  *      })
  */
  lookupTvrage: function(id, options){
    return(this.lookup("tvrage", id, options));
  },

  /**
  *  Get the TV schedule for a country and date
  *  @param {string} [countryCode] - ISO 3166-1 code of the country
  *  @param {string} [date] - ISO 8601 formatted date
  *  @param {Object} [options] - Url request options
  *  @return {Promise} Promise object of result data as JSON
  *  @see https://www.tvmaze.com/api#schedule
  *  @see https://en.wikipedia.org/wiki/ISO_8601#Dates
  *  @see https://en.wikipedia.org/wiki/ISO_3166-1
  *  @example
  *    schedule("GB", "2019-03-23").
  *      then(response => {
  *        console.log(response);
  *      })
  *      .catch(error => {
  *        console.log(error);
  *      })
  */
  schedule: function(countryCode, date, options){
    const query = {
      countrycode: countryCode,
      date: date
    };

    return this.sendRequest(
      `schedule`,
      Object.assign(
        {},
        options,
        {
          query: query
        }
      )
    );
  },

  /**
  *  Get the every future episode known to TVmaze
  *  @param {Object} [options] - Url request options
  *  @return {Promise} Promise object of result data as JSON
  *  @see https://www.tvmaze.com/api#full-schedule
  *  @example
  *    fullSchedule().
  *      then(response => {
  *        console.log(response);
  *      })
  *      .catch(error => {
  *        console.log(error);
  *      })
  */
  fullSchedule: function(options){
    return this.sendRequest(
      `schedule/full`,
      options
    );
  },

  /**
  *  Get the main information for a show, supports embedding
  *  @param {number} showid - Tvmaze show ID
  *  @param {string[]} [emded] - Required embeds
  *  @param {Object} [options] - Url request options
  *  @return {Promise} Promise object of result data as JSON
  *  @see https://www.tvmaze.com/api#show-main-information
  *  @see https://www.tvmaze.com/api#embedding
  *  @example
  *    show("396", ['episodes']).
  *      then(response => {
  *        console.log(response);
  *      })
  *      .catch(error => {
  *        console.log(error);
  *      })
  */
  show: function(showid, embed, options){
    const query = {
      "embed[]": embed
    };

    return this.sendRequest(
      `shows/${showid}`,
      Object.assign(
        {},
        options,
        {
          query: (embed) ? query : null
        }
      )
    )
  },

  /**
  *  Get a complete list of episodes in airing order for a show
  *  @param {number} showid - Tvmaze show ID
  *  @param {boolean} [specials=false] - include special episodes
  *  @param {Object} [options] - Url request options
  *  @return {Promise} Promise object of result data as JSON
  *  @see https://www.tvmaze.com/api#show-episode-list
  *  @example
  *    episodes(396, true).
  *      then(response => {
  *        console.log(response);
  *      })
  *      .catch(error => {
  *        console.log(error);
  *      })
  */
  episodes: function(showid, specials, options){
    const query = {
      "specials": 1
    };

    return this.sendRequest(
      `shows/${showid}/episodes`,
      Object.assign(
        {},
        options,
        {
          query: (specials) ? query : null
        }
      )
    )
  },

  /**
  *  Get information for a single episode of a show
  *  @param {number} showid - Tvmaze show ID
  *  @param {number} season - Season number
  *  @param {number} episode - Episode number
  *  @param {Object} [options] - Url request options
  *  @return {Promise} Promise object of result data as JSON
  *  @see https://www.tvmaze.com/api#episode-by-number
  *  @example
  *    episode(396, 1, 1).
  *      then(response => {
  *        console.log(response);
  *      })
  *      .catch(error => {
  *        console.log(error);
  *      })
  */
  episode: function(showid, season, episode, options){
    const query = {
      "season": season,
      "number": episode
    };

    return this.sendRequest(
      `shows/${showid}/episodebynumber`,
      Object.assign(
        {},
        options,
        {
          query: query
        }
      )
    )
  },

  /**
  *  Get episodes aired on a date
  *  @param {number} showid - Tvmaze show ID
  *  @param {string} date - ISO 8601 formatted date
  *  @param {Object} [options] - Url request options
  *  @return {Promise} Promise object of result data as JSON
  *  @see https://www.tvmaze.com/api#episodes-by-date
  *  @see https://en.wikipedia.org/wiki/ISO_8601#Dates
  *  @example
  *    episodesByDate(321, "2019-03-15").
  *      then(response => {
  *        console.log(response);
  *      })
  *      .catch(error => {
  *        console.log(error);
  *      })
  */
  episodesByDate: function(showid, date, options){
    const query = {
      "date": date
    };

    return this.sendRequest(
      `shows/${showid}/episodesbydate`,
      Object.assign(
        {},
        options,
        {
          query: query
        }
      )
    )
  },

  /**
  *  Get season list information
  *  @param {number} showid - Tvmaze show ID
  *  @param {Object} [options] - Url request options
  *  @return {Promise} Promise object of result data as JSON
  *  @see https://www.tvmaze.com/api#show-seasons
  *  @example
  *    seasons(321).
  *      then(response => {
  *        console.log(response);
  *      })
  *      .catch(error => {
  *        console.log(error);
  *      })
  */
  seasons: function(showid, options){
    return this.sendRequest(
      `shows/${showid}/seasons`,
      options
    );
  },

  /**
  *  Get all episodes for a season
  *  @param {number} seasonid - Tvmaze season ID
  *  @param {Object} [options] - Url request options
  *  @return {Promise} Promise object of result data as JSON
  *  @see https://www.tvmaze.com/api#season-episodes
  *  @example
  *    seasonEpisodes(1).
  *      then(response => {
  *        console.log(response);
  *      })
  *      .catch(error => {
  *        console.log(error);
  *      })
  */
  seasonEpisodes: function(seasonid, options){
    return this.sendRequest(
      `seasons/${seasonid}/episodes`,
      options
    );
  },


  /**
  *  Get cast information
  *  @param {number} showid - Tvmaze season ID
  *  @param {Object} [options] - Url request options
  *  @return {Promise} Promise object of result data as JSON
  *  @see https://www.tvmaze.com/api#show-cast
  *  @example
  *    cast(174).
  *      then(response => {
  *        console.log(response);
  *      })
  *      .catch(error => {
  *        console.log(error);
  *      })
  */
  cast: function(showid, options){
    return this.sendRequest(
      `shows/${showid}/cast`,
      options
    );
  },

  /**
  *  Get crew information
  *  @param {number} showid - Tvmaze season ID
  *  @param {Object} [options] - Url request options
  *  @return {Promise} Promise object of result data as JSON
  *  @see https://www.tvmaze.com/api#show-crew
  *  @example
  *    crew(49).
  *      then(response => {
  *        console.log(response);
  *      })
  *      .catch(error => {
  *        console.log(error);
  *      })
  */
  crew: function(showid, options){
    return this.sendRequest(
      `shows/${showid}/crew`,
      options
    );
  },

  /**
  *  Get all aliases
  *  @param {number} showid - Tvmaze season ID
  *  @param {Object} [options] - Url request options
  *  @return {Promise} Promise object of result data as JSON
  *  @see https://www.tvmaze.com/api#show-aka
  *  @example
  *    aliases(49).
  *      then(response => {
  *        console.log(response);
  *      })
  *      .catch(error => {
  *        console.log(error);
  *      })
  */
  aliases: function(showid, options){
    return this.sendRequest(
      `shows/${showid}/akas`,
      options
    );
  },

  /**
  *  Get the full list of shows and details on TVmaze (250 results per page, in ID order)
  *  @param {number} [page] - page number
  *  @param {Object} [options] - Url request options
  *  @return {Promise} Promise object of result data as JSON
  *  @see https://www.tvmaze.com/api#show-index
  *  @example
  *    showsIndex(1).
  *      then(response => {
  *        console.log(response);
  *      })
  *      .catch(error => {
  *        console.log(error);
  *      })
  */
  showsIndex: function(page, options){
    const query = {
      "page": page
    };

    return this.sendRequest(
      `shows`,
      Object.assign(
        {},
        options,
        {
          query: (page) ? query : null
        }
      )
    )
  },

  /**
  *  Get the full list of show IDs and last updated timestamp (ID order)
  *  @param {Object} [options] - Url request options
  *  @return {Promise} Promise object of result data as JSON
  *  @see https://www.tvmaze.com/api#show-updates
  *  @example
  *    showUpdates().
  *      then(response => {
  *        console.log(response);
  *      })
  *      .catch(error => {
  *        console.log(error);
  *      })
  */
  showUpdates: function(options){
    return this.sendRequest(
      `updates/shows`,
      options
    )
  },

  /**
  *  Get all information for a person ID, Supports embed
  *  @param {number} personid - Person ID number
  *  @param {string[]} [embed] - Embed options
  *  @param {Object} [options] - Url request options
  *  @return {Promise} Promise object of result data as JSON
  *  @see https://www.tvmaze.com/api#person-main-information
  *  @see https://www.tvmaze.com/api#embedding
  *  @example
  *    person(37135, ['castcredits']).
  *      then(response => {
  *        console.log(response);
  *      })
  *      .catch(error => {
  *        console.log(error);
  *      })
  */
  person: function(personid, embed, options){
    const query = {
      "embed[]": embed
    };

    return this.sendRequest(
      `people/${personid}`,
      Object.assign(
        {},
        options,
        {
          query: (embed) ? query : null
        }
      )
    )
  },

  /**
  *  Get cast credits for a person ID, supports embedding
  *  @param {number} personid - Person ID number
  *  @param {string[]} [embed] - Embed options
  *  @param {Object} [options] - Url request options
  *  @return {Promise} Promise object of result data as JSON
  *  @see https://www.tvmaze.com/api#person-cast-credits
  *  @see https://www.tvmaze.com/api#embedding
  *  @example
  *    personCastCredits(37135, ['show']).
  *      then(response => {
  *        console.log(response);
  *      })
  *      .catch(error => {
  *        console.log(error);
  *      })
  */
  personCastCredits: function(personid, embed, options){
    const query = {
      "embed[]": embed
    };

    return this.sendRequest(
      `people/${personid}/castcredits`,
      Object.assign(
        {},
        options,
        {
          query: (embed) ? query : null
        }
      )
    )
  },

  /**
  *  Get crew credits for a person ID, supports embedding
  *  @param {number} personid - Person ID number
  *  @param {string[]} [embed] - Embed options
  *  @param {Object} [options] - Url request options
  *  @return {Promise} Promise object of result data as JSON
  *  @see https://www.tvmaze.com/api#person-crew-credits
  *  @see https://www.tvmaze.com/api#embedding
  *  @example
  *    personCrewCredits(100, ['show']).
  *      then(response => {
  *        console.log(response);
  *      })
  *      .catch(error => {
  *        console.log(error);
  *      })
  */
  personCrewCredits: function(personid, embed, options){
    const query = {
      "embed[]": embed
    };

    return this.sendRequest(
      `people/${personid}/crewcredits`,
      Object.assign(
        {},
        options,
        {
          query: (embed) ? query : null
        }
      )
    )
  },

  /**
   * Send API request and return JSON
   * @private
   * @param {string} path - Url path postfix
   * @param {Object} options - Url request options
   * @return {Promise} Promise object of Json data
   * @example
   *   sendRequest("people/250/castcredits", {
   *     query: {
   *         embed: ['show']
   *       }
   *     })
   *      .then(response => {
   *        console.log(response);
   *      })
   *      .catch(error => {
   *        console.log(error);
   *      })
   */
  sendRequest : function(path, options){
    // Merge default options and user options
    const opts = Object.assign({}, DEFAULT_OPTIONS, options);

    // Switch https/http based on user or default settings
    const base_url = (opts.https) ? ("https://" + BASE_URL) : ("http://" + BASE_URL);

    // format Url
    const requestUrl = base_url + url.format({
      pathname: path,
      query: opts.query
    });

    // Create Request options
    const requestOpts = {
      method: 'GET',
      url: requestUrl,
      headers: opts.header
    }

    // Execute request and return promise
    return axios(requestOpts)
      .then(response => {
        // axios encapsulates the response data within a data property, so return response.data
        return response.data;
      })
      .catch(error => {
        throw error;
      });
}
}

module.exports = Tvmaze;
