module EITI
  module Glossary
    def term_html(str, term, term_class = nil)
      "<span class='term #{term_class}' data-term='#{term}' \
                title='Click to define' tabindex='0'>#{str}<icon \
                class='icon-book'></icon></span>"
    end

    def term_str(str, term, terms = nil, term_class = nil)
      if terms
        terms_available = terms.map { |t| t[0].downcase }
        if terms_available.include? term
          term_html(str, term, term_class)
        else
          str
        end
      else
        term_html(str, term, term_class)
      end
    end

    def term(str, term = nil, terms = nil, term_class = nil)
      ##
      # Converts a string to a glossary link with book icon.
      #
      # Usage:
      # {{ "word" | term }} >>>
      # <span class="term"
      #       data-term="word"
      #       title="Click to define"
      #       tabindex="0"
      #       style="margin-right:5px">
      #   word
      #   <icon class="icon-book"></icon>
      # </span>
      # {{ "word" | term:"alternative def" }} >>>
      # <span class="term"
      #       data-term="alternative def"
      #       title="Click to define"
      #       tabindex="0"
      #       style="margin-right:5px">
      #   word
      #   <icon class="icon-book"></icon>
      # </span>
      term ||= str
      term_str(str, term, terms, term_class)
    end

    def term_end(str, term = nil, terms = nil)
      term(str, term, terms, 'term-end')
    end
  end
end

Liquid::Template.register_filter(EITI::Glossary)
