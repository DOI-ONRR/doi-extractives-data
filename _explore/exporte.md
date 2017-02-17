---
title: Exporte
layout: default
permalink: /explore/exporte/
breadcrumb:
  - title: Fakten
    permalink: /explore/
nav_items:
  - name: title
    title: Seitenanfang
  - name: chart-1
    title: Rohstoffexporte aus Deuschland 2010-2015
  - name: chart-2
    title: Deutsche Rohstoffexporte 2015
  - name: daten-einsehen
    title: Daten einsehen
---

<link rel="stylesheet" type="text/css" href="{{ site.baseurl_root }}/css/slick-theme.css"/>
<link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/jquery.slick/1.6.0/slick.css"/>

<main class="container-page-wrapper layout-state-pages">
  <section class="container" style="position: relative;">

    {% include breadcrumb.html %}
    <h1 id="title">Exporte</h1>

    <div class="container-left-9">
        <p>
          Deutschland ist von einer stark exportorientierten und diversifizierten Wirtschaftsstruktur gekennzeichnet. 2015 exportierte das Land  Waren im Wert von insgesamt 1.193 Milliarden Euro. Dabei entfielen rund 10 Milliarden Euro auf Waren der rohstoffgewinnenden Industriei, was einem Anteil von 0,84 % an den Gesamtexporten entspricht. Erdöl und Erdgas machten dabei mit 8,4 Milliarden Euro den größten Anteil an den Exporten aus, gefolgt von Steinen, Erden und sonstigen Bergbauerzeugnissen mit 1,3 Milliarden Euro. Zudem wurden Erze im Wert von 134 Mio. € und Kohle im Wert von 125 Mio. € exportiert. Seit 2010 haben sich die Exporte von Erdöl und Erdgas nahezu verdoppelt.
        </p>
        <br />
        <div id="chart-2" class="explore-exploration slab-alpha">
          <div class="regions container">
            <div class="graph">
              <div class="container chart-container">
                <div id="pieChart"></div>
              </div>
            </div>
          </div>
        </div>
        <br/>
        <div id="chart-1" class="explore-exploration slab-alpha">
          <div class="regions container">
            <div class="graph">
              <div class="container chart-container">
                <div id="chart1" style="height: 600px"></div>
                <table class="legend" id="legend"></table>
              </div>
            </div>
          </div>
        </div>
        <div style="margin-top: 110px !important">
          <a href="{{site.baseurl}}/downloads/#exporte">
            <icon class="fa fa-file-text-o u-padding-right"></icon>Daten Einsehen
          </a>
        </div>
    </div>
    <div class="sticky sticky_nav container-right-3">
      <h3 class="state-page-nav-title container">
        <div class="nav-title">{{ page.title }}</div>
      </h3>
      <nav>
        {% include case-studies/_nav-list.html %}
      </nav>
    </div>
  </section>
</main>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script type="text/javascript" src="//cdn.jsdelivr.net/jquery.slick/1.6.0/slick.min.js"></script>
<script type="text/javascript" src="{{ site.baseurl_root }}/js/lib/static.min.js" charset="utf-8"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/jquery.jqplot.min.js"></script>
<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/jquery.jqplot.min.css"/>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/plugins/jqplot.barRenderer.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/plugins/jqplot.pieRenderer.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/plugins/jqplot.categoryAxisRenderer.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/plugins/jqplot.pointLabels.min.js"></script>

<script type="text/javascript" src="{{ site.baseurl_root }}/js/pages/barGraph.js" charset="utf-8"></script>
<script type="text/javascript" src="{{ site.baseurl_root }}/js/pages/pieGraph.js" charset="utf-8"></script>
<script type="text/javascript" src="{{ site.baseurl_root }}/js/lib/explore.min.js" charset="utf-8"></script>
