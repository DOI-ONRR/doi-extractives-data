module EITI

  module Format

    def plural(num, plural="s")
      (num.to_i == 1) ? "" : plural
    end

    def percent(num, precision=1, small="&lt;1")
      if num == nil
        # FIXME what should we represent null % as?
        return '--'
      end

      num = num.to_f
      # zero is zero
      if num == 0
        return '0'
      # if it's less than 1, return the "small" representation
      elsif num < 1.0
        return small
      end
      # if it has decimal precision, format it
      if num % 1 > 0
        return num.round(precision)
      end

      # puts "percent(#{num}, #{precision}, '#{small}')"
      num.to_i
    end

  end

end

Liquid::Template.register_filter(EITI::Format)
