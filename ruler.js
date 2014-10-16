
/**
 * This a very simplified rules engine written as
 * an AngularJS module.
 *
 * @author Cecil Worsley IV <cecilworsley4@gmail.com>
 * @since 2014-06-21
 */
angular.module('rvRuler', [])

  /**
   * Factory for an individual rule.
   * @return {[object]}
   */
  .factory('rvRule', function () {

    var Rule = {};

    /**
     * This method tages a dot delemited string,
     * and retrieves the value contailed in the
     * data parameter.
     *
     * @param  {[string]} path [example: 'chat.meta.activePage']
     * @param  {[object]} data [typically chat object]
     * @return {[mixed]}
     */
    Rule.pluck = function (path, data) {
      var parts = path.split('.');
      var index = 1; // Skip the first index
      var value = '';

      while(index < parts.length) {
        var part = parts[index];
        value = data[part];
        data = data[part];
        index++;
      }
      return value;
    };

    /**
     * Basic prototype for simple conparisons
     *
     * @param {[obj]} params
     * @param {[obj]} data
     */
    var Basic = function (params, data) {
      this.a = Rule.pluck(params.path, data);
      this.b = params.match;
    };

    // equal
    Basic.prototype.eq = function () {
      return this.a === this.b;
    };

      // not equal
    Basic.prototype.neq = function () {
      return this.a !== this.b;
    };

    // greater than
    Basic.prototype.gt = function () {
      return this.a > this.b;
    };

    // less than
    Basic.prototype.lt = function () {
      return this.a < this.b;
    };

    // greater than equal to
    Basic.prototype.gte = function () {
      return this.a >= this.b;
    };

    // less than equal to
    Basic.prototype.lte = function () {
      return this.a <= this.b;
    };


    var Regex = function (params, data) {
      this.params = params;
      this.data = data;
    };

    /**
     * This method evaluates a rule that uses regex.
     * @return {[bool]}
     */
    Regex.prototype.match = function () {
      var comparisonValue = Rule.pluck(this.params.path, this.data);
      var exp = new RegExp(this.params.pattern, this.params.flags || 'i');
      if(typeof comparisonValue === 'undefined') {
        return false;
      }

      var result = comparisonValue.match(this.params.pattern);

      if (!result) return false;

      result = result.indexOf(this.params.match);

      if(result > -1) {
        return true;
      } else {
        return false;
      }
    };

    // attach prototypes to rules object
    Rule.Basic = Basic;
    Rule.Regex = Regex;

    return Rule;

  })
  .service('rvRules', function (rvRule) {

    var ruler = {

      // List of applicable rules
      rules: [],

      /**
       * You can add many filters at once With an array of objects;
       * @param  {[array]} rules [array of objects]
       * @return {[self]}
       */
      setRules: function (rules) {
        this.rules = rules;
        return this;
      },

      /**
       * Add filter to filter array
       * @param {[string]} comparison [string that corrisponds with a Rule method]
       * @param {[mixed]} a
       * @param {[mixed]} b
       */
      add: function (rule) {
        this.rules.push(rule);
        return this;
      },

      /**
       * Execute the filters and return true if they all pass and false if
       * one fails.
       * @param  {[object]} data
       * @param  {[function]} callback
       * @param  {[function]} callback
       * @return {[bool]}
      */
      exec: function (data, pass, fail) {
        pass = pass || angular.noop;
        fail = fail || angular.noop;

        if(this.rules.length === 0) {
          return true;
        }

        for(var i = 0; i < this.rules.length; i++) {
          var filter = this.rules[i];
          this.rules = [];
          var result = new rvRule[filter.kind](filter.params, data)[filter.params.comparison]();
          if(result === false) {
            fail(); // callback
            return false;
          }
        }
        pass(); // callback
        return true;
      }
    };

    return ruler;

  });
