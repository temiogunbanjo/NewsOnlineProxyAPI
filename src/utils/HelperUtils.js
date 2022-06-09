const axios = require('axios');

/**
@class
* */
class HelperUtils {
  static DEFAULT_FILTERS = {
    page: 1,
    limit: 10,
    startDate: new Date(1920, 0, 1, 24).toISOString(),
    endDate: new Date().toISOString(),
    order: ['createdAt:DESC'], // Sort by latest
  };

  /**
   * @param {Object} query
   * @returns Object
   */
  static mapAsFilter(query) {
    const userFilters = query;
    this.DEFAULT_FILTERS.endDate = new Date().toISOString();
    
    Object.keys(userFilters).forEach((param) => {
      if (userFilters[param].includes(',')) {
        userFilters[param] = userFilters[param]
          .split(',')
          .map((eachValue) => eachValue.trim())
          .filter(value => value !== '');
      }
      else if (param === 'startDate' || param === 'endDate') {
        const [date, month, year] = userFilters[param].split('/');
        // console.log(date, month - 1, year);
        userFilters[param] = new Date(year, month - 1, date, 24).toISOString();
      }
      else if (userFilters[param].match(/\d+/g) && param !== 'search'){
        userFilters[param] = parseInt(userFilters[param], 10);
      }
    });
    // Merge Default filters and user filters
    const filters = { ...this.DEFAULT_FILTERS, ...userFilters };
    // console.log(filters);
    return filters;
  }

  static async fetchUrl(url, options = { method: 'GET' }) {
    console.log(url, options);
    const response = await axios({ url, ...options });
    return response;
  }
}

module.exports = HelperUtils;
