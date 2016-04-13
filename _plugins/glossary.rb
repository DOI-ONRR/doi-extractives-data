module EITI
  module Glossary
    def term(str, term = nil)
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
      if !term
        return "<span class='term' data-term='#{str}' \
          title='Click to define' tabindex='0'>#{str}<icon \
          class='icon-book'></icon></span>"
      else
        return "<span class='term' data-term='#{term}' \
          title='Click to define' tabindex='0'>#{str}<icon \
          class='icon-book'></icon></span>"
      end
    end

    def term_end(str, term = nil)
      ##
      # Same as term, but eliminates margin to the right of the book icon
      #
      # Usage:
      # {{ "word" | term }} >>>
      # <span class="term"
      #       data-term="word"
      #       title="Click to define"
      #       tabindex="0">
      #   word
      #   <icon class="icon-book"></icon>
      # </span>
      # {{ "word" | term:"alternative def" }} >>>
      # <span class="term"
      #       data-term="alternative def"
      #       title="Click to define"
      #       tabindex="0" >
      #   word
      #   <icon class="icon-book"></icon>
      # </span>
      if !term
        return "<span class='term term-end' data-term='#{str}' \
          title='Click to define' tabindex='0'>#{str}<icon \
          class='icon-book'></icon></span>"
      else
        return "<span class='term term-end' data-term='#{term}' \
          title='Click to define' tabindex='0'>#{str}<icon \
          class='icon-book'></icon></span>"
      end
    end
  end
end

Liquid::Template.register_filter(EITI::Glossary)
