require 'csv'

if ARGV.length > 1
  csv_path = File.join('./', ARGV[0])
  tsv_path = File.join('./', ARGV[1])

  File.open(tsv_path, 'w') do |out|
    CSV.foreach(csv_path) do |line|
      out.write(line.join("\t") + "\n")
    end
  end
else
  puts 'Please add file paths'
  puts 'ruby csv_tsv.rb path/to/csv path/to/tsv'
end
