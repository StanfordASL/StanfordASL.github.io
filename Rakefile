desc "Build _site/ for production"
task :build do
  puts "\n## Building Jekyll to _site/"
  status = system("JEKYLL_ENV=production bundle exec jekyll build")
  status ? puts("SUCCESS") : abort("FAILED")
end

desc "Preview _site/"
task :preview do
  puts "\n## Previewing Jekyll to _site/"
  status = system("bundle exec jekyll serve")
  status ? puts("SUCCESS") : abort("FAILED")
end
