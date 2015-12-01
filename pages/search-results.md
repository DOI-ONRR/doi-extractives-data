---
title: Search Results
layout: default
permalink: /search-results/
---

<div class="container-outer container-padded">

  <div class="container-left-7">

    <h1>{{page.title}}</h1>

    <p class="search-intro">This is a curated search.<br/> Results are drawn from related websites across the U.S. government.</p>

    <div id="search-results-container">

      <div class="container search-header">
        <p>Search results for <strong class='search-string'></strong></p>
        <p id="search-results-count"></p>
      </div>

      <div class="container" id="search-results-container">
        <h1 class="loading">Loading...</h1>
      </div>

      <div class="search-no-results" id="search-no-results" style="display:none;">
        <h1>Sorry, no results were found for your search.</h1>
        <h2>Try a new search:</h2>

        <div class="search-container">
          <form action='{{ site.baseurl }}/search-results/'>
            <label for='q' class='sr-only'>Search</label>
            <input type="search" placeholder="Search related resources..." name="q" id="q"/>
            <button type="submit" class="search-icon icon-search"></button>
          </form>
        </div>

        <p><strong>Or, try one of these popular searches </strong>
          / <a href="../search/?q=energy" title="Search for energy">energy</a> /
          <a href="../search/?q=oil" title="Search for oil">oil</a> /
          <a href="../search/?q=conservation" title="Search for conservation">conservation</a> /
        </p>
      </div>

      <div class="container">
        <p class="credit">Search powered by <a href="https://github.com/18F/beckley">Beckley Beta</a></p>
      </div>


    </div>

  </div>

</div>
