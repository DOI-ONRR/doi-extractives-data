import React from 'react';

const BasicLayout = () => (
  <section className="layout-content container-page-wrapper container-margin">
    <article className="container-left-7 container-shift-reverse-2">
      <a href="#" className="breadcrumb">Optional breadcrumb link</a>
      <h1 id="intro">Example text page</h1>
      <blockquote>
        <p>This page uses a grid of seven columns on the left and three on the right, with a two-column margin between. The right-side block can hold a sticky nav unit, or be left empty. This opening paragraph is a “blockquote,” which has this larger type style built in.</p>
      </blockquote>

      <h2 id="section-1">Page section one</h2>
      <p>I see that our enticingly large intro paragraph has done its job and lead you here to the meat of the page. We think you’ll be glad that you stuck around to see the content we have to offer!</p>

      <h2 id="section-2">Section with a table</h2>
      <p>Here’s a table integrated with the text of a page. Tables come in various shapes and sizes, as you can see in the tables layout section of the style guide.</p>

      <table className="article_table">
        <thead>
          <tr>
            <th>Header</th>
            <th>Second header</th>
            <th>Third column header</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Tabular content</td>
            <td>Content such as a phrase or sentence</td>
            <td>Content such as a phrase or sentence</td>
          </tr>
          <tr>
            <td>Tabular content</td>
            <td>Content such as a phrase or sentence</td>
            <td>Content such as a phrase or sentence</td>
          </tr>
          <tr>
            <td>Tabular content</td>
            <td>Content such as a phrase or sentence</td>
            <td>Content such as a phrase or sentence</td>
          </tr>
        </tbody>
      </table>

      <h2 id="section-3">Graphically anchored paragraphs</h2>
      <p>Content accompanied by 100 x 100-pixel images such as icons or agency seals.</p>

      <div className="bureaus">
        <article className="bureau">
          <div className="bureau-left">
            <img className="bureau-image" src="../../img/placeholder.png" alt="description" />
          </div>
          <div className="bureau-right">
            <h4>Subsection title</h4>
            <p>Paragraph with image alongside.</p>
          </div>
        </article>
      </div>
    </article>

    <div className="pre-sticky pre-sticky-small" />
    <nav className="sticky sticky-float sticky_nav">
      <ul>
        <a href="#" className="sticky_nav-nav_item" data-nav-item="intro" data-active="true">Top</a>
        <a href="#section-1" className="sticky_nav-nav_item" data-nav-item="page-section-one" data-active="false">Page section one</a>
        <a href="#section-2" className="sticky_nav-nav_item" data-nav-item="section-with-table" data-active="false">Section with a table</a>
        <a href="#section-3" className="sticky_nav-nav_item" data-nav-item="section-embellished" data-active="false">Embellished paragraphs</a>
      </ul>
    </nav>
  </section>
);

export default BasicLayout;
