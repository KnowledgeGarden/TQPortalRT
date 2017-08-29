# Topic Template API #
##Background
The topic.hbs template plays roles in displaying any topic from the topic map, including users, tags, etc. Its task is to present a *dashboard* into that topic's characteristics and relations.

Note that any topic (except users or tags) can be used as a *node* (statement) in a *conversation tree*. For that reason, each node needs to be aware of the conversations in which it is a member.

Note, we define the term *pivot* as meaning a specific kind of relationship with another topic. Pivots are these:<br/>
- Tags on this topic<br/>
- Documents created by this user, where documents (topics) include tags, blog posts, social bookmarks, conversation nodes, and wiki topics<br/>
- A user who created this document<br/>
- Transclusions made by this user, where a transclusion is the process of injecting an existing topic into another view, that is, a particular conversation.

The purpose of this document is to describe the *datanames* and their *values* which must be made available to the template in a JSON object when the template is rendered.


The template is broken into *tabs*, each for a specific purpose. We list them next, then we talk about specific data elements necessary to satisy the template's display needs.<br/>
**Topic Tab**<br/>
This is the basic Topic Dashboard. It will display certain metadata about the topic, a label (title) for the topic, any descriptive text (e.g. if this is a blog post, it displays the post's subject and body). And, it will display any pivots related to that topic.<br/>
**List Tab**<br/>
This tab is the same as the Topic Tab, except that it presents information in a linear list (for mobile devices)<br/>
**CConv Tab**<br/>
This tab presents a list of conversations in which this topic is a member as a *child* node to some other node in that conversation.<br/>
**PConv Tab**<br/>
This tab presents all conversations in which this topic is a *parent* node; this node starts a conversation. That's possible with blog posts, wiki topics, bookmarks, and conversation root nodes.<br/>
**Source Tab**<br/>
This tab simply presents the JSON string that is the topic map's representation of this topic. Used mostly for debugging.<br/>
**Relations Tab**<br/>
Every topic can be wired to other topics with so-called coherence-relations. For example, topic A can be wired to topic B with a relation like "agrees with", or "disagrees with" or "is analogous to" and so forth. This tab allows to view all such relations, and, for authenticated users, to create new relations.<br/>
**Tree Tab**<br/>
This tab will show this node as a root in any conversation; that is, if it has any child nodes, regardless of how many different conversations, they will all be displayed.
##API
The API breaks down to three kinds of data:<br/>
- Boolean data which serves as directives<br/>
- List data which provides list of information to paint<br/>
- Detailed data such as labels, userId, url, text, and more.<br/>
###Boolean Data
- canEdit  if true, means that an Edit button can be made visible<br/>
- showTags if true, then make visible the tag pivots<br/>
- showUsers if true, then make visible the user pivots<br/>
- showDocs  if true, then make visible the documents pivots<br/>
- showTranscludes  if true, then make visible the transcludes pivots<br/>

###List Data
- tags  a list of tags to display
- users  a list of users to display
- documents a list of documents to display
- transcludes a list of transcludes to display

###Detailed Data
- lIco is the topic's large Icon
- label is the topic's label
- userid is the identifier of the user who created this topic
- username is the name of this user
- date  is the date this topic was created (or last edited)
- details  is a rich-text object which is the primary text for this topic, such as a blog post, wiki topic, etc.
- source  is the JSON string representation of this topic

NOTE: more values to add here.
