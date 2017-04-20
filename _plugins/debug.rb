module Jekyll
  module Debug
    def debug(value, second_value = nil, third_value = nil)
      _type = value.class
      _second_type = second_value.class
      _third_type = third_value.class
      puts '---------------------'
      puts "#{value} is a #{_type}"
      puts '---------------------'
      binding.pry
    end

  end
end


Liquid::Template.register_filter(Jekyll::Debug)
