---
date:   2019-03-09 00:00:00
md_group: "announcements"
---

Office hours for week 10 will be held in Skilling.

#### **Demo day logistics**
You should plan for a 3 min presentation followed by a 10 min demo. Please sign up for a slot for your demo [**here**](https://docs.google.com/spreadsheets/d/12u7L8p8qwx-4xPYzLP_0Vpln-qsofhjlY53ex-cESmI/edit?usp=sharing)

Try to find a time slot that works for as many people on your team as possible.

#### **Delivery Logistics**

As you drive around the environment, you should log locations of objects that the detector detects (i.e., different objects that are in the COCO dataset that the detector was trained on).

After the explore phase, we will ask you which objects you were able to log, and then request some of those items. The form of the request will come as a ROS string message to the topic "/delivery_request" which will contain a string of object labels delimited by commas. 

For example, a message might be: "banana,apple". You can parse this string using string_name.split(‘,’) 

We have uploaded a script request_publisher.py to the asl_turtlebot github repo that asks for input and publishes the message in this form, feel free to use it for testing.


#### **Detector changes**

We have fixed a bug in the distance estimation in the detector (see estimate_distance in the new files to see what changes were made). Additionally, we have added a more powerful CNN model to the jetsons (a 50-layer ResNet model), which performs better than the mobilenet model that we were using previously. We have updated the project branch to reflect these changes. Please read the README again.

For more details on how to incorporate these updates into your code and Turtlebot, please refer to the email with subject "AA274 Announcement: (Important) Demo day logistics, delivery logistics, detector changes, remarks" for more details.

