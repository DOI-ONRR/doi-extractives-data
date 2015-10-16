---
---
/* global require, module, document */


// var accessibility = require('./accessibility');

var KEYCODE_ESC = 27;

var ITEM_TEMPLATE =
  '<li id="glossary-list-item" class="glossary__item">' +
    '<div class="js-accordion_header accordion__header">' +
      '<h4 class="glossary-term"></h4>' +
      '<button class="button button--secondary accordion__button js-accordion_button">' +
        '<span class="js-accordion_text u-visually-hidden" data-show="Show definition" data-hide="Hide definition"></span>' +
      '</button>' +
    '</div>' +
    '<p class="glossary-definition js-accordion_item"></p>' +
  '</li>';

var ITEM_TEMPLATE =
'<li id="glossary-list-item" class="glossary__item">' +
  '<h3 class="glossary-term"></h3>' +
  '<p class="glossary-definition js-accordion_item"></p>' +
'</li>';

var defaultSelectors = {
  body: '#glossary',
  toggle: '.js-glossary-toggle',
  term: '.term'
};

/**
 * Glossary widget
 * @constructor
 * @param {Array} terms - Term objects with "glossary-term" and "glossary-definition" keys
 * @param {Object} selectors - CSS selectors for glossary components
 */
function Glossary(terms, selectors) {
  var self = this;

  self.terms = terms;
  self.selectors = _.extend({}, defaultSelectors, selectors);

  self.$body = $(self.selectors.body);
  self.$toggle = $(self.selectors.toggle);
  self.$search = this.$body.find('.glossary__search');

  // Initialize state
  self.isOpen = false;

  // Update DOM
  self.populate();
  self.linkTerms();

  // Remove tabindices 
  // accessibility.removeTabindex(self.$body);
  
  // Bind listeners
  self.$toggle.on('click', this.toggle.bind(this));
  self.$body.on('click', '.toggle', this.toggle.bind(this));
  self.$search.on('input', this.handleInput.bind(this));
  $(document.body).on('keyup', this.handleKeyup.bind(this));
}

/** Populate internal list.js list of terms */
Glossary.prototype.populate = function() {
  var options = {
    item: ITEM_TEMPLATE,
    valueNames: ['glossary-term'],
    listClass: 'glossary__list',
    searchClass: 'glossary__search'
  };
  this.list = new List('glossary', options, this.terms);
  // this.list.sort('glossary-term', {order: 'asc'});
};

/** Add links to terms in body */
Glossary.prototype.linkTerms = function() {
  var self = this;
  var $terms = $(self.selectors.term);
  $terms.each(function(){
    var $term = $(this);
    $term.attr('title', 'Click to define')
      .attr('tabindex', 0)
      .data('term', $term.data('term').toLowerCase());
  });
  $terms.on('click keypress', function(e) {
    if (e.which === 13 || e.type === 'click') {
      self.show();
      self.findTerm($(this).data('term'));
    }
  });
};

/** Highlight a term */
Glossary.prototype.findTerm = function(term) {
  this.$search.val(term);

  // Highlight the term and remove other highlights
  this.$body.find('.term--highlight').removeClass('term--highlight');
  this.$body.find('span[data-term="' + term + '"]').addClass('term--highlight');
  this.list.filter(function(item) {
    return item._values['glossary-term'].toLowerCase() === term;
  });

  // Hack: Expand text for selected item
  this.list.search();
  _.each(this.list.visibleItems, function(item) {
    var $elm = $(item.elm).find('div');
    if ($elm.hasClass('accordion--collapsed')) {
      $elm.find('.accordion__button').click();
    }
  });
};

Glossary.prototype.toggle = function() {
  var method = this.isOpen ? this.hide : this.show;
  method.apply(this);
};

Glossary.prototype.show = function() {
  this.$body.addClass('is-open').attr('aria-hidden', 'false');
  this.$toggle.addClass('active');
  this.$search.focus();
  this.isOpen = true;
  // accessibility.restoreTabindex(this.$body);
};

Glossary.prototype.hide = function() {
  this.$body.removeClass('is-open').attr('aria-hidden', 'true');
  this.$toggle.removeClass('active');
  this.$toggle.focus();
  this.isOpen = false;
  // accessibility.removeTabindex(this.$body);
};

/** Remove existing filters on input */
Glossary.prototype.handleInput = function(e) {
  if (this.list.filtered) {
    this.list.filter();
  }
};

/** Close glossary on escape keypress */
Glossary.prototype.handleKeyup = function(e) {
  if (e.keyCode == KEYCODE_ESC) {
    if (this.isOpen) {
      this.hide();
    }
  }
};

// var terms = [];
$.getJSON('{{site.baseurl}}/js/terms.json')
  .done(function(terms) {
    // console.warn( "second success", data );
    var glossary = new Glossary(terms, {body: '#glossary'});
    console.log(glossary)
  })

// console.log(terms)

var terms = [
  {
    "glossary-term": "Status",
    "glossary-definition": "Refers to whether the candidate is an incumbent, challenger or running unopposed."
  },
  {
    "glossary-term": "Candidate ID",
    "glossary-definition": "A unique identifier assigned to each candidate registered with the FEC. The initial character indicates the office sought. (H)ouse, (S)enate, (P)resident. If a person runs for several offices, they will have separate Candidate IDs for each office."
  },
  {
    "glossary-term": "Party",
    "glossary-definition": "Party affiliation as stated on a candidate’s \"Statement of Candidacy.\""
  },
  {
    "glossary-term": "District",
    "glossary-definition": "A U.S. House of Representatives District. Because Senators represent an entire state, Senate races do not have districts associated with them."
  },
  {
    "glossary-term": "Organization type",
    "glossary-definition": "Certain filers, like Separate Segregated Funds, certain types of PACs, and Communication Cost filers identify the types of organizations they are associated with.  These entities can be associated with corporations, trade associations, labor organizations, cooperatives, membership organizations, or corporations without capital stock, or have no association."
  },
  {
    "glossary-term": "Committee type",
    "glossary-definition": "A definition that categorizes groups organized to raise and spend money in federal elections. The basic committee types are principal campaign committee, political party committee, and political action committee (PAC)."
  },
  {
    "glossary-term": "Total receipts",
    "glossary-definition": "The sum of all money received by a committee as reported to the FEC, including contributions, during a filing period."
  },
  {
    "glossary-term": "Total disbursements",
    "glossary-definition": "The sum of all money spent by a committee as reported to the FEC during a filing period."
  },
  {
    "glossary-term": "Ending cash on hand",
    "glossary-definition": "The ending cash balance on a report for a particular time period. Cash on hand includes funds held in checking and savings accounts, certificates of deposit, petty cash funds, traveler’s checks, treasury bills and other investments valued at cost."
  },
  {
    "glossary-term": "Debt",
    "glossary-definition": "The amount of money a committee owes to other entities at the end of the filing period."
  },
  {
    "glossary-term": "Joint fundraising",
    "glossary-definition": "Fundraising conducted jointly by a political committee and one or more other political committees or unregistered organizations.  Joint fundraising is often conducted between a principal campaign committee and a political party committee."
  },
  {
    "glossary-term": "Joint fundraising committee",
    "glossary-definition": "A committee that has been set up for the purposes of fundraising for multiple committees at the same time, or an existing committee that has been authorized to serve that purpose."
  },
  {
    "glossary-term": "Reports and statements",
    "glossary-definition": "All committees registered with the FEC are required to file reports and statements regularly that disclose their financial activity.  The contents of those reports and statements, as well as the filing schedule, depend on the type of committee or organization."
  },
  {
    "glossary-term": "Filing",
    "glossary-definition": "A report or statement submitted to the FEC by a candidate, committee, or other filing entity. Entities are required to file to declare their status as a candidate or committee and to report the money they raise and spend."
  },
  {
    "glossary-term": "Authorized committee",
    "glossary-definition": "A committee that has been authorized by a candidate to raise or spend money on his or her behalf."
  },
  {
    "glossary-term": "Committee",
    "glossary-definition": "An entity that meets one of the following conditions:<ul class='list--bulleted'><li>An authorized committee of a candidate (see definition of candidate)</li><li>A state party committee or nonparty committee, club, association or other group of persons that receives contributions or makes  expenditures, either of which aggregate over $1,000 during a calendar year</li><li>A local unit of a political party (except a state party committee) that: (1) receives contributions aggregating over $5,000 during  a calendar year; (2) makes contributions or  expenditures either of which aggregate over  $1,000 during a calendar year; or (3) makes payments aggregating over $5,000 during a  calendar year for certain activities which are exempt from the definitions of contribution and expenditure (11 CFR 100.80, 100.87 and 100.89;  11 CFR 100.140, 100.147 and 100.149)</li><li>Any separate segregated fund upon its establishment. 11 CFR 100.5.</li><ul>"
  },
  {
    "glossary-term": "Principal campaign committee",
    "glossary-definition": "An authorized committee designated by a candidate as the principal committee to raise contributions and make expenditures for his or her campaign for a federal office."
  },
  {
    "glossary-term": "Candidate",
    "glossary-definition": "An individual seeking nomination for election, or election, to a federal office becomes a candidate when he or she (or agents working on his or her behalf) raises contributions or makes expenditures that exceed $5,000."
  },
  {
    "glossary-term": "None",
    "glossary-definition": "If data appears as \"None\", it is best to check the source document. Common reasons that the data appears as \"None\" are:<ul class='list--bulleted'><li>Data is not processed yet; often, paper filings cause delays and inconsistent upload times.</li><li>Data is from an amendment that did not properly identify the form it was amending.</li><li>The filer did not fill out the information on the form.</li></ul>If you think there is an error, you can report that via <a href='mailto:betafeedback@fec.gov'>email</a>."
  },
  {
    "glossary-term": "Independent expenditure",
    "glossary-definition": "An expenditure for a communication that expressly advocates the election or defeat of a clearly identified candidate and that is not made in cooperation, consultation or concert with, or at the request or suggestion of, any candidate, or his or her authorized committees or agents, or a political party committee or its agents. 11 CFR 100.16."
  },
  {
    "glossary-term": "Electioneering communication",
    "glossary-definition": "Any broadcast, cable or satellite communication that: <ul><li>Refers to a clearly identified candidate for federal office;</li><li>Is publicly distributed within certain time periods before an election; and</li><li>Is targeted to the relevant electorate.</li></ul>11 CFR 100.29."
  },
  {
    "glossary-term": "Communication cost",
    "glossary-definition": "52 U.S.C. 30118 allows \"communications by a corporation to its stockholders and executive or administrative personnel and their families or by a labor organization to its members and their families on any subject,\" including the express advocacy of the election or defeat of any federal candidate. The costs of such communications must be reported to the Federal Election Commission under certain circumstances."
  },
  {
    "glossary-term": "Receipt",
    "glossary-definition": "Anything of value (money, goods, services of property) received by a political committee."
  },
  {
    "glossary-term": "Disbursement",
    "glossary-definition": "Any purchase or payment made by a political committee or any other person that is subject to FECA. 11 CFR 300.2(d)."
  },
  {
    "glossary-term": "Separate Segregated Fund (SSF)",
    "glossary-definition": "A political committee established, administered or financially supported by a corporation or labor organization, popularly called a corporate or labor political action committee or PAC. 11 CFR 114.1(a)(2)(iii). The term \"financially supported\" does not include contributions to the SSF but does include the payment of establishment, administration or solicitation costs. 11 CFR 100.6(b)."
  }
]

// module.exports = {Glossary: Glossary};
