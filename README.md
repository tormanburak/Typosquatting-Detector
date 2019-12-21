# Typosquatting-Detector

<b>General information :</b> <br>
Domain squatting refers to the attackers' practice of using domain names that are deceptively similar to popular domain names, as a way of getting user traffic and confusing users about the nature of any one given site. The most popular type of domain squatting is called typosquatting and it capitalizes on a user's typos. Attackers register domain such as twwitter.com (two 'w's instead of one), wwwpaypal.com (missing dot between "www" and paypal.com) and gankofamerica.com (neighboring character of 'b') and can then expose users to a wide range of abuse.

<b>Project description :</b> <br>
Purpose of this project is to design and implement a distributed typosquatting detector. Architecture consists of one master node and N worker nodes. The master node receives a new job (request to scan for typosquatting domains for a new domain), generates the possible squatting variants, and then places these variants in a queue. Worker nodes will consume domains from that queue, and then visit these domains using a headless Chrome browser. Each worker then reports back to the master node with a screenshot and the HTML code of each "alive" typosquatting domain. The master node then assembles these in an HTML report which the user of this tool can inspect using a web dashboard.

<b>Project components :</b> <br>
<ul>
  <li>
    <p>Master node with web dashboard where users can submit new scans and see the resulting reports of old scans.<br>
Given a domain name, the master node generates the possible typosquatting variants of that domain name and request the workers to scan them. <br>
    </p>
  </li>
  <li>
    <p>
The master node must push all possible typosquatting variants to a queue where they will be consumed by one or more workers. <br>
    </p>
  </li>
    <li>
    <p>
Each worker node uses Headless Chrome to "crawl" each variant, collecting a screenshot and the HTML code of each discovered typosquatting domain. <br>
    </p>
  </li>
  <li>
    <p>
Producer-consumers system provides a way for new workers to "report for duty" and be added to the pool of available scanning nodes.
Scaling is as easy as registering new workers.<br>
    </p>
  </li>
</ul>

