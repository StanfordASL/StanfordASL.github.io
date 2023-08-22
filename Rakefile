desc "Check git status"
task :check do
  puts "\n## Checking that current branch is 'main'"
  status = system('[ "$(git branch --show-current)" = "main" ]')
  status ? puts("SUCCESS") : abort("`rake` commands must be run from the 'main' branch!`")
  puts "\n## Checking that working copy is up-to-date with remote"
  status = system(
    "[ $(git rev-parse HEAD) = $(git ls-remote $(git rev-parse --abbrev-ref @{u} | sed 's|/| |g') | cut -f1) ]")
  status ? puts("SUCCESS") :
           abort("Your working copy (local) is not up-to-date with remote; `git pull` and merge as necessary")
end

desc "Git push"
task :commit do
  puts "\n## Staging modified files"
  status = system("git add -A")
  status ? puts("SUCCESS") : abort("FAILED")
  puts "\n## Committing a site build at #{Time.now.utc}"
  message = "Build site at #{Time.now.utc}"
  status = system("git commit -m \"#{message}\"")
  status ? puts("SUCCESS") : abort("FAILED")
  puts "\n## Pushing commits to remote"
  status = system("git push origin main")
  status ? puts("SUCCESS") : abort("FAILED")
end

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

desc "Build source and commit"
task :publish => [:check, :build, :check, :commit] do
end
