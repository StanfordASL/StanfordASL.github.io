---
date:   2019-02-27 00:00:00
md_group: "announcements"
---

The rviz/project_sim.rviz file on the asl_turtlebot project branch as been updated. Previously, the configuration had a large window size (suitable for a desktop, but unsuitable for the VM) and this caused the launch file to crash. The updated file now has a suitable window size for your laptops/VMs. 

If you have not changed anything in your project branch, you should be able to 'git pull' to get the updated file. Otherwise, you can 'git fetch' then 'git checkout path/to/project_sim.rviz' to prevent overwriting your local changes. If you are uncomfortable with using git, then alternatively, you can use your own custom RViz config file and change 
<a href="https://github.com/StanfordASL/asl_turtlebot/blob/project/launch/project_sim_pose.launch#L67">this line</a> accordingly.

