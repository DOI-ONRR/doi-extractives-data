module EITI

  module SVG

    # calculate the padding-bottom % for the SVG padding hack:
    # <http://tympanus.net/codrops/2014/08/19/making-svgs-responsive-with-css/>
    #
    # usage:
    #
    # style="padding-bottom: {{ viewbox | svg_viewbox_padding }}%;"
    def svg_viewbox_padding(viewbox, width = nil)
      if !width || width == "inherit"
        width = 100
      end

      # if we get a string, split it into 4 parts and map its strings to floats
      # (otherwise we'll get integer precision in the division below)
      if viewbox.is_a? String
        viewbox = viewbox.split(" ").map(&:to_f)
      elsif !viewbox.is_a? Array
        # FIXME: throw an error here?
        return width
      end

      viewbox[3] / viewbox[2] * width
    end

  end

end

Liquid::Template.register_filter(EITI::SVG)
