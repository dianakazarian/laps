
# Linear Algebra for Political Scientists
_Overview: Introduction of the section content._

## Session 1
### Structure

The majority of linear algebra courses are organized as follows: an introduction to vectors and matrices as a means of storing data, followed by systems of linear equations and how to solve them, linear transformations, matrix operations, eigenvalues and eigenvectors, and then, finally, the big miracle that makes this semester-long build-up worth our while: the method of least squares, or what we will often simply refer to under the blanket term of "regression." 

In this series of lecture notes, we will make the somewhat unorthodox decision to begin at the end. That is, we will first introduce regression: the single most important tool for political scientists conducting any kind of quantitative work. Having a working familiarity with regression will allow us to clearly frame our research questions in terms of inputs and outputs. With this clear framing in mind, we will then jump back to the basics, and develop fluency in all of the relevant operations listed above. The purpose of this approach is to always keep sight of the applied use-cases that are motivating our study of linear algebra in the first place.

### How Are Research Questions Born?

Many questions in political science result from a conviction that multiple things are related to one another. A scholar specializing in the USSR, for example, might notice that the countries of the South Caucasus (Armenia, Azerbaijan, and Georgia), have both weak economies and weak democracies, while the countries of the Baltics (Estonia, Latvia, and Lithuania), have strong(er) economies and strong(er) democracies. But the Baltics and the South Caucasus also differ in a third way: proximity to the West. The Baltics were fast-tracked into EU accession; the South Caucasus states largely were not. So is economic growth really driving democratization, or are both being pulled along by a country's relationship with the West? At this point, this scholar may start collecting some preliminary data.

<table>
<thead>
<tr><th>Country</th><th>Region</th><th>GDP growth</th><th>EU Integration</th><th>Democracy Score</th></tr>
</thead>
<tbody>
<tr><td>Armenia</td><td>South Caucasus</td><td>3</td><td>2</td><td>3</td></tr>
<tr><td>Azerbaijan</td><td>South Caucasus</td><td>4</td><td>1</td><td>2</td></tr>
<tr><td>Georgia</td><td>South Caucasus</td><td>3</td><td>3</td><td>4</td></tr>
<tr><td>Estonia</td><td>Baltics</td><td>7</td><td>9</td><td>8</td></tr>
<tr><td>Latvia</td><td>Baltics</td><td>6</td><td>8</td><td>7</td></tr>
<tr><td>Lithuania</td><td>Baltics</td><td>7</td><td>8</td><td>8</td></tr>
</tbody>
</table>


 So just how related are these two phenomena? We might wish for the fo

a more general research question is born: 

Why does sustained economic growth seem to increase the likelihood that authoritarian regimes democratize?




<div class="callout definition">
<div class="label">Definition: Object to Define</div>

Here is the definition. Here are the list of required properties:

<ol type="i">
  <li>property 1.</li>
  <li>property 2.</li>
  <li>property 3.</li>
</ol>

</div>

We now introduce a proposition.

<div class="callout proposition">
<div class="label">Proposition: Property to Define</div>

Here is the proposition. *This only holds under the described circumstances*. ***We truly want to emphasize this.***

</div>

<details class="collapsible">
<summary>Proof</summary>
<div class="collapsible__content">

Here is the proof of the above proposition.

<details class="collapsible">
<summary>Proof of the sub-proposition</summary>
<div class="collapsible__content">

Here is the sub-proof.

</div>
</details>

</div>
</details>
