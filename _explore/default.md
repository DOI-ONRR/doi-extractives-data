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

<section accordion="explore-landing" accordion-desktop="false" class="container-outer landing-wrapper">
  <section class="container">
    <a id="production" class="link-no_under">
      <h2 class="h3 landing-section_category">
        {% t 'explore-data.production.heading-1' %}
      </h2>
    </a>
    <div class="container-left-3 tile" accordion-item>
      {% if site.lang == "de" %}
        <a href="{{ site.baseurl_root }}/explore/federal-production" class="production_sub_heading_1 tile-item">
          <div class="production-picture">
            <div class="production-name">
              {% t 'explore-data.production.sub-heading-1' %}
            </div>
          </div>
        </a>
      {% elsif site.lang == "en" %}
        <a href="{{ site.baseurl_root }}/en/explore/federal-production" class="production_sub_heading_1 tile-item">
          <div class="production-picture">
            <div class="production-name">
              {% t 'explore-data.production.sub-heading-1' %}
            </div>
          </div>
        </a>
      {% endif %}
    </div>
    <div class="container-left-3 tile" accordion-item>
      {% if site.lang == "de" %}
        <a href="{{ site.baseurl_root }}/explore/production-charts" class="production_sub_heading_2 tile-item">
          <div class="production-picture">
            <div class="production-name">
              {% t 'explore-data.production.sub-heading-2' %}
            </div>
          </div>
        </a>
      {% elsif site.lang == "en" %}
        <a href="{{ site.baseurl_root }}/en/explore/production-charts" class="production_sub_heading_2 tile-item">
          <div class="production-picture">
            <div class="production-name">
              {% t 'explore-data.production.sub-heading-2' %}
            </div>
          </div>
        </a>
      {% endif %}
    </div>
  </section>
  <section class="container">
    <a id="revenue" class="link-no_under">
      <h2 class="h3 landing-section_category">
        {% t 'explore-data.revenue.heading-1' %}
      </h2>
    </a>
    <div class="container-left-3 tile" accordion-item aria-expanded="true">
      <a class="revenue_sub_heading_1 tile-item not_active">
        <div class="production-picture">
          <div class="production-name">
            {% t 'explore-data.revenue.sub-heading-1' %}
          </div>
        </div>
      </a>
    </div>
  </section>
  <section class="container">
    <a id="economic-impact" name="economic-impact" class="link-no_under">
      <h2 class="h3 landing-section_category tile-item">
        {% t 'explore-data.economic-impact.heading-1' %}
      </h2>
    </a>
    <div class="container-left-3 tile" accordion-item aria-expanded="true">
      <a class="economic_impact_sub_heading_1 tile-item not_active">
        <div class="production-picture">
          <div class="production-name">
            {% t 'explore-data.economic-impact.sub-heading-1' %}
          </div>
        </div>
      </a>
    </div>
  </section>
</section>

<script type="text/javascript" src="{{ site.baseurl_root }}/js/lib/homepage.min.js" charset="utf-8"></script>
