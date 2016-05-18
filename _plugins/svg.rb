module EITI

  module SVG

    # calculate the padding-bottom % for the SVG padding hack:
    # <http://tympanus.net/codrops/2014/08/19/making-svgs-responsive-with-css/>
    #
    # usage:
    #
    # style="padding-bottom: {{ viewbox | svg_viewbox_padding }}%;"
    def svg_viewbox_padding(viewBox, width=100)
      # if we get a string, split it into 4 parts and map its strings to floats
      # (otherwise we'll get integer precision in the division below)
      if viewBox.is_a? String
        viewBox = viewBox.split(" ").map{ |n| n.to_f }
      end
      return viewBox[3] / viewBox[2] * width
    end

  end

end

Liquid::Template.register_filter(EITI::SVG)
