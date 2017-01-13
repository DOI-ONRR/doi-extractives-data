---
title: Daten entdecken
layout: default
permalink: /explore/
---

<section class="slab-delta">
  <div class="container-outer landing-section_top">
    <div class="container-left-8 hero-left">
      <h1>{% t 'explore-data.title' %}</h1>
      <p class="hero-description">{% t 'explore-data.introduction-first' %}</p>
      <p class="hero-description">{% t 'explore-data.introduction-second' %}</p>
    </div>
    <div class="container-right-4 hero-right">
      <div class="hero-right_square">
        <figure>
          <a href="#production">
            <img class="hero-right_image" src="{{ site.baseurl_root }}/img/explore-landing-intro.png" alt="Explore landing intro">
          </a>
          <figcaption class="hero-right_caption">
            {% t 'explore-data.figcaption' %}
          </figcaption>
        </figure>
      </div>
    </div>
  </div>
</section>

<section class="container-outer landing-wrapper">
  <section class="container">
    <a id="production" class="link-no_under">
      <h2 class="h3 landing-section_category">
        {% t 'explore-data.production.heading-1' %}
      </h2>
    </a>
    <div class="container-half landing-section" accordion-item>
      <h3 class="h5 landing-heading">
        {% if site.lang == "de" %}
          <a href="{{ site.baseurl_root }}/explore/federal-production">
            {% t 'explore-data.production.sub-heading-1' %}
          </a>
        {% elsif site.lang == "en" %}
          <a href="{{ site.baseurl_root }}/en/explore/federal-production">
            {% t 'explore-data.production.sub-heading-1' %}
          </a>
        {% endif %}
      </h3>
      <div>
        <p class="landing-description">
          {% t 'explore-data.production.description-1' %}
        </p>
      </div>
    </div>
    <div class="container-half landing-section" accordion-item>
      <h3 class="h5 landing-heading">

        {% if site.lang == "de" %}
          <a href="{{ site.baseurl_root }}/explore/production-charts">
            {% t 'explore-data.production.sub-heading-2' %}
          </a>
        {% elsif site.lang == "en" %}
          <a href="{{ site.baseurl_root }}/en/explore/production-charts">
            {% t 'explore-data.production.sub-heading-2' %}
          </a>
        {% endif %}
      </h3>
      <div>
        <p class="landing-description">
          {% t 'explore-data.production.description-2' %}
        </p>
      </div>
    </div>
  </section>
  <section class="container">
    <a id="revenue" class="link-no_under">
      <h2 class="h3 landing-section_category">
        {% t 'explore-data.revenue.heading-1' %}
      </h2></a>
    <div class="container-half landing-section" accordion-item aria-expanded="true">
      <h3 class="h5 landing-heading"><a href="#">
        {% t 'explore-data.revenue.sub-heading-1' %} </a>
      </h3>
      <div>
        <p class="landing-description">
          {% t 'explore-data.revenue.description-1' %}
        </p>
      </div>
    </div>
  </section>
  <section class="container">
    <a id="economic-impact" name="economic-impact" class="link-no_under">
      <h2 class="h3 landing-section_category">
        {% t 'explore-data.economic-impact.heading-1' %}
      </h2></a>
    <div class="container-half landing-section" accordion-item>
      <h3 class="h5 landing-heading"><a>
        {% t 'explore-data.economic-impact.sub-heading-1' %}</a>
      </h3>
      <div>
        <p class="landing-description">
          {% t 'explore-data.economic-impact.description-1' %}
        </p>
      </div>
    </div>
  </section>
</section>

<script type="text/javascript" src="{{ site.baseurl_root }}/js/lib/homepage.min.js" charset="utf-8"></script>
