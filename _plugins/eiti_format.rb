require 'liquid'

module EITI
  module Format
    # module_function
    # returns the singular suffix of a value if the value is 1,
    # otherwise the singular form
    #
    # >> EITI::Format.plural(100)
    # => 's'
    # >> EITI::Format.plural(1)
    # => ''
    # >> EITI::Format.plural(1, 'ies', 'y')
    # => 'y'
    # >> EITI::Format.plural(2, 'ies', 'y')
    # => 'ies'
    def plural(num, plural = 's', singular = '')
      num.to_i == 1 ? singular : plural
    end


    # format a number as a percentage with fixed precision, with an
    # additionally configurable "small" placeholder to indicate values
    # less than 1.
    #
    # >> EITI::Format.percent(10.5)
    # => 10.5
    # >> EITI::Format.percent(10.5, 0)
    # => 11
    # >> EITI::Format.percent(0.5)
    # => '&lt;1'
    # >> EITI::Format.percent(0.5, 0, '?')
    # => '?'
    def percent(num, precision = 1, small = '&lt;1')
      if num.is_a? String
        num = num.to_f
      end
      if num.nil?
        # XXX: what should we represent null % as?
        return '--'
      # zero is zero
      elsif num.zero?
        return '0'
      # if it's less than 1, return the "small" representation
      elsif num < 1.0
        return small
      # if it has decimal precision, format it
      elsif num % 1 > 0
        return num.round(precision)
      end

      # puts "percent(#{num}, #{precision}, "#{small}")"
      num.to_i
    end

    # >> EITI::Format.suffix('foo', 'bar')
    # => 'foo bar'
    # >> EITI::Format.suffix('foo')
    # => 'foo'
    def suffix(text, suffix = '')
      suffix.empty? ? text : "#{text} #{suffix}"
    end
  end
end

Liquid::Template.register_filter(EITI::Format)
