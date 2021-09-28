desc "Check git status"
task :check do
  puts "\n## Checking that current branch is 'source'"
  status = system('[ "$(git branch --show-current)" = "source" ]')
  status ? puts("SUCCESS") : abort("`rake` commands must be run from the 'source' branch!`")
  puts "\n## Checking that working copy is up-to-date with remote"
  status = system(
    "[ $(git rev-parse HEAD) = $(git ls-remote $(git rev-parse --abbrev-ref @{u} | sed 's|/| |g') | cut -f1) ]")
  status ? puts("SUCCESS") :
           abort("Your working copy (local) is not up-to-date with remote; `git pull` and merge as necessary")
end

desc "Build _site/ for production"
task :build do
  puts "\n## Building Jekyll to _site/"
  status = system("JEKYLL_ENV=production bundle exec jekyll build")
  status ? puts("SUCCESS") : abort("FAILED")
end

desc "Commit _site/"
task :commit do
  puts "\n## Staging modified files"
  status = system("git add -A")
  status ? puts("SUCCESS") : abort("FAILED")
  puts "\n## Committing a site build at #{Time.now.utc}"
  message = "Build site at #{Time.now.utc}"
  status = system("git commit -m \"#{message}\"")
  status ? puts("SUCCESS") : abort("FAILED")
  puts "\n## Pushing commits to remote"
  status = system("git push origin source")
  status ? puts("SUCCESS") : abort("FAILED")
end

desc "Deploy _site/ to master branch"
task :deploy do
  puts "\n## Deleting master branch"
  status = system("git branch -D master")
  status ? puts("SUCCESS") : abort("FAILED")
  puts "\n## Creating new master branch and switching to it"
  status = system("git checkout -b master")
  status ? puts("SUCCESS") : abort("FAILED")
  puts "\n## Forcing the _site subdirectory to be project root"
  status = system("git filter-branch --subdirectory-filter _site/ -f")
  status ? puts("SUCCESS") : abort("FAILED")
  puts "\n## Switching back to source branch"
  status = system("git checkout source")
  status ? puts("SUCCESS") : abort("FAILED")
  puts "\n## Pushing all branches to origin"
  status = system("git push -f --all origin")
  status ? puts("SUCCESS") : abort("FAILED")
end

desc "Commit and deploy _site/"
task :publish => [:check, :build, :commit, :deploy] do
end
