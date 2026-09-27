_Overview: We ask what a matrix actually does to a vector, and find that a special few vectors (eigenvectors) only get stretched, never redirected. We then apply this fact to the variance-covariance matrix itself to distill many correlated variables down to the handful of dimensions that actually drive their variation (principal component analysis)._

<a class="resource-link" href="slides/laps_session_4.pdf" target="_blank" rel="noopener">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
  Session 4 Slides (.pdf)
</a>

## What Does a Matrix Actually Do to Space?

In Session 1, we became familiar with the mechanical process of multiplying a matrix and a vector together. In Sessions 2 and 3, we put that process to use by calculating $A\mathbf{w}$ in order to build composite scores and $X\hat \beta$ in order to build predictions. Now, we will step back for a moment and ask a more general question: what does multiplying by some matrix $A$ actually *do* to a vector?


In general, $A\mathbf{v}$ points in a completely different direction from $\mathbf{v}$ itself, and has a different length. Multiplying by a matrix, in other words, typically rotates a vector <em>and</em> rescales it, both at once.

<div class="callout example">
<span class="label"><span class="callout-type">Example</span></span>
Let $A = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$ and $\mathbf{v} = \begin{bmatrix} 1 \\ 0 \end{bmatrix}$. Then
$$
A\mathbf{v} = \begin{bmatrix} 2(1)+1(0) \\ 1(1)+2(0) \end{bmatrix} = \begin{bmatrix} 2 \\ 1 \end{bmatrix}
$$
$\mathbf{v}$ pointed straight along the first axis; $A\mathbf{v}$ points somewhere else entirely (up and to the right, at roughly a $27^\circ$ angle from where $\mathbf{v}$ started). Its length changed too: $\|\mathbf{v}\|=1$, while $\|A\mathbf{v}\|=\sqrt{2^2+1^2}=\sqrt5\approx2.24$. $A$ rotated $\mathbf{v}$ <em>and</em> stretched it.

<svg viewBox="0 0 260 220" width="320" style="display:block;margin:1rem auto;">
  <!-- axes -->
  <line x1="20" y1="180" x2="240" y2="180" stroke="gray" stroke-width="1"/>
  <line x1="20" y1="180" x2="20" y2="10" stroke="gray" stroke-width="1"/>

  <!-- gridlines -->
  <line x1="20" y1="180" x2="240" y2="180" stroke="#ddd" stroke-dasharray="2,2"/>
  <line x1="90" y1="10" x2="90" y2="180" stroke="#eee"/>
  <line x1="160" y1="10" x2="160" y2="180" stroke="#eee"/>
  <line x1="230" y1="10" x2="230" y2="180" stroke="#eee"/>
  <line x1="20" y1="110" x2="240" y2="110" stroke="#eee"/>
  <line x1="20" y1="40" x2="240" y2="40" stroke="#eee"/>

  <!-- v = (1,0) -->
  <defs>
    <marker id="arrowV" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#534AB7"/>
    </marker>
    <marker id="arrowAv" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#0F6E56"/>
    </marker>
  </defs>

  <line x1="20" y1="180" x2="88" y2="180" stroke="#534AB7" stroke-width="2.5" marker-end="url(#arrowV)"/>
  <text x="70" y="196" fill="#534AB7" font-size="13">v = (1,0)</text>

  <!-- Av = (2,1) -->
  <line x1="20" y1="180" x2="158" y2="112" stroke="#0F6E56" stroke-width="2.5" marker-end="url(#arrowAv)"/>
  <text x="160" y="105" fill="#0F6E56" font-size="13">Av = (2,1)</text>
</svg>

</div
>

This is the typical case: nearly every vector gets pushed off in some new direction like this. The question that opens the rest of this section is whether any vector escapes that rotation entirely.



<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">Eigenvector and Eigenvalue</span></span>
For a square matrix $A$, a nonzero vector $\mathbf{v}$ is an <em>eigenvector</em> of $A$ if
$$
A\mathbf{v} = \lambda\mathbf{v}
$$
for some scalar $\lambda$, called the corresponding <em>eigenvalue</em>. In words: $A$ doesn't rotate $\mathbf{v}$ at all: it only stretches or shrinks it, by a factor of $\lambda$.
</div>

Most vectors are not eigenvectors of a given $A$. For a generic $\mathbf{v}$, $A\mathbf{v}$ points somewhere new. Eigenvectors are the special handful of directions (out of infinitely many) along which $A$'s entire effect collapses to simple scaling. They matter because they reveal $A$'s "natural axes," or the directions along which its behavior is easiest to describe. 

<div class="callout example">
Now try $\mathbf{w} = (1,1)$ instead:

$$A\mathbf{w} = \begin{bmatrix} 2 & 1 \\\\ 1 & 2 \end{bmatrix}\begin{bmatrix} 1 \\\\ 1 \end{bmatrix} = \begin{bmatrix} 3 \\\\ 3 \end{bmatrix} = 3\begin{bmatrix} 1 \\\\ 1 \end{bmatrix} = 3\mathbf{w}$$

Here $A$'s entire effect on $\mathbf{w}$ is to scale it by $3$: same direction in, same direction out. So $\mathbf{w}$ *is* an eigenvector of $A$, with eigenvalue $\lambda = 3$.

</div>

## Finding Eigenvalues and Eigenvectors

We have now seen both the definition
$A\mathbf{v}=\lambda\mathbf{v}$ and some examples of eigenvectors and non-eigenvectors. How, then, do we systematically find eigenvalues and eigenvetors given a matrix $A$?

We will start by rewriting the defining equation with everything on one side: $A\mathbf{v}-\lambda\mathbf{v}=\mathbf{0}$. To factor out $\mathbf{v}$, write $\lambda\mathbf{v}$ as $\lambda I\mathbf{v}$ (multiplying by the identity changes nothing, but now both terms are matrix-vector products):
$$
A\mathbf{v}-\lambda I\mathbf{v} = \mathbf{0} \quad\Longrightarrow\quad (A-\lambda I)\mathbf{v} = \mathbf{0}
$$

This says $(A-\lambda I)$ sends the nonzero vector $\mathbf{v}$ to the zero vector,  which, from Session 2, means $(A-\lambda I)$ is singular: its determinant must be zero. This gives us a direct way to find every valid $\lambda$.


<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">Characteristic Equation</span></span>
The eigenvalues of $A$ are exactly the solutions $\lambda$ to
$$
\det(A-\lambda I) = 0
$$
</div>

<div class="callout example">
<span class="label"><span class="callout-type">Example</span></span>
Let $A = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$.

<br>
<br>

We find the eigenvalues using the definition above.
$$
A-\lambda I = \begin{bmatrix} 2-\lambda & 1 \\ 1 & 2-\lambda \end{bmatrix}
$$
$$
\det(A-\lambda I) = (2-\lambda)^2 - 1 = 0 \quad\Longrightarrow\quad (2-\lambda)^2=1 \quad\Longrightarrow\quad 2-\lambda=\pm1
$$
So $\lambda=1$ or $\lambda=3$.

We will now find the eigenvector that corresponds to each eigenvalue. We start with  $\lambda=3$. Plug back into $(A-\lambda I)\mathbf{v}=\mathbf{0}$:
$$
\begin{bmatrix} -1 & 1 \\ 1 & -1 \end{bmatrix}\begin{bmatrix} v_1 \\ v_2 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix} \quad\Longrightarrow\quad -v_1+v_2=0 \quad\Longrightarrow\quad v_1=v_2
$$
So $\mathbf{v}_1 = \begin{bmatrix} 1 \\ 1 \end{bmatrix}$ (or any scalar multiple of it) is an eigenvector, with eigenvalue $3$.

We now find the eigenvector for the other eigenvalue, $\lambda=1$.
$$
\begin{bmatrix} 1 & 1 \\ 1 & 1 \end{bmatrix}\begin{bmatrix} v_1 \\ v_2 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix} \quad\Longrightarrow\quad v_1+v_2=0 \quad\Longrightarrow\quad v_1=-v_2
$$
So $\mathbf{v}_2 = \begin{bmatrix} 1 \\ -1 \end{bmatrix}$ is an eigenvector, with eigenvalue $1$.

Verify: $A\mathbf{v}_1 = \begin{bmatrix} 2+1 \\ 1+2 \end{bmatrix} = \begin{bmatrix} 3 \\ 3 \end{bmatrix} = 3\mathbf{v}_1$ ✓, and $A\mathbf{v}_2 = \begin{bmatrix} 2-1 \\ 1-2 \end{bmatrix} = \begin{bmatrix} 1 \\ -1 \end{bmatrix} = 1\cdot\mathbf{v}_2$ ✓.

Therefore, we have found the only two vectors such that if we multiply them by $A$, they maintain their original direction.
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
Notice that $\mathbf{v}_1=(1,1)$ and $\mathbf{v}_2=(1,-1)$ are orthogonal to each other: ($\mathbf{v}_1\cdot\mathbf{v}_2=1-1=0$). This is a consequence of a unique property of $A$, which we take up below.
</div>

### Symmetric Matrices Are Special

$A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$ is a symmetric matrix ($A^\top=A$), and its eigenvectors came out perpendicular. Indeed, this is a general property of symmetric matrices.



<div class="callout proposition">
<span class="label"><span class="callout-type">Proposition</span> <span class="callout-title">The Spectral Theorem</span></span>
If $S$ is a symmetric matrix, then:
<ol>
<li>All of $S$'s eigenvalues are real numbers (never complex).</li>
<li>Eigenvectors corresponding to different eigenvalues are orthogonal to each other.</li>
</ol>
</div>

This is exactly what we saw with $A=\begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$: eigenvalues $\lambda=1,3$ (both real, no surprise needed there), and eigenvectors $(1,1)$, $(1,-1)$, which dot to zero. The Spectral Theorem guarantees this result for *any* symmetric matrix.



## Principal Component Analysis

Every matrix we've worked with since Session 3 has come with a designated outcome we cared about: democracy scores, predicted by growth and integration. PCA answers a different kind of question, with no outcome variable at all: given a set of variables that are correlated with each other, is there a smaller number of "directions" that capture most of what's actually going on in the data? This comes up constantly in political science — survey batteries with a dozen related items, or a dataset like V-Dem with dozens of separately measured but substantively overlapping indicators. PCA takes such variables and finds the combination(s) of them that vary the most, so that a handful of numbers can stand in for many.

We'll build this out first on the two variables we already know well — growth and integration — where the answer is checkable by eye, before turning to a case with more variables where the payoff is bigger.

Session 3 defined $\Sigma$ in general and showed its shape for growth and integration specifically:
$$
\Sigma = \begin{bmatrix} \text{Var(growth)} & \text{Cov(growth, integration)} \\ \text{Cov(integration, growth)} & \text{Var(integration)} \end{bmatrix}
$$
but never filled it in with numbers. Instead, we moved straight on to $\text{Var}(\hat\beta)$. This time, we will return to $\Sigma$ itself and compute it.

<div class="callout example">
<span class="label"><span class="callout-type">Example</span></span>
Using the six-country growth and integration data from Session 1, the variance-covariance matrix works out to
$$
\Sigma = \begin{bmatrix} \tfrac{18}{5} & \tfrac{31}{5} \\ \tfrac{31}{5} & \tfrac{377}{30} \end{bmatrix}
$$

As before, we calculate the eigenvalues by solving $\det(\Sigma-\lambda I)=0$:
$$
\det(\Sigma-\lambda I) = \begin{vmatrix} \tfrac{18}{5}-\lambda & \tfrac{31}{5} \\ \tfrac{31}{5} & \tfrac{377}{30}-\lambda \end{vmatrix} = \left(\tfrac{18}{5}-\lambda\right)\left(\tfrac{377}{30}-\lambda\right) - \left(\tfrac{31}{5}\right)^2 = 0
$$
Simplifying, we get:
$$
30\lambda^2 - 485\lambda + 204 = 0
$$
$$
\lambda = \frac{485\pm\sqrt{485^2-4(30)(204)}}{60} = \frac{485\pm\sqrt{210745}}{60}
$$
$$
\lambda_1\approx15.73, \qquad \lambda_2\approx0.43
$$

To get the eigenvector corresponding to $\lambda_1$, we substitute $\lambda_1\approx15.73$ into $(\Sigma-\lambda_1 I)\mathbf{v}=0$ and use either row (they must agree, since $\det=0$ at an eigenvalue):
$$
\left(\tfrac{18}{5}-\lambda_1\right)v_1+\tfrac{31}{5}v_2=0 \quad\Longrightarrow\quad v_2\approx1.957\,v_1
$$
So $(1,\,1.957)$ solves the system; normalizing (dividing by its length, $\sqrt{1^2+1.957^2}\approx2.198$) gives the unit eigenvector:
$$
\mathbf{v}_1 \approx (0.455,\,0.890)
$$

By the Spectral Theorem, $\Sigma$'s two eigenvectors must be orthogonal. In two dimensions, "orthogonal to $\mathbf{v}_1$" pins down the direction of $\mathbf{v}_2$ completely, because it's just $\mathbf{v}_1$ rotated $90°$, $(-0.890,\,0.455)$ with no separate system to solve.

</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
The eigenvectors of $\Sigma$ point along the axes of the ellipse traced out by the data's spread; the corresponding eigenvalues measure how stretched the data is along each axis.

</div>

$\mathbf{v}_1$'s entries are weights on growth and integration, and we can read them the way we've read every weighted combination this course: integration's weight ($0.890$) is nearly double growth's ($0.455$), so the direction our six countries differ *most* along leans on integration more than growth.


Two variables collapsing to one dominant direction isn't especially impressive on its own, of course. The actual utility of this method becomes clear when we have many correlated variables at once, which we take up below.

## Reducing Many Columns to a Few Dimensions

The real payoff of PCA shows up once there are more than two variables, and survey data is where political scientists run into this constantly. Consider a battery of questions from the World Values Survey, all asking about trust in different kinds of people:

1. To what extent do you trust people in your family?
2. To what extent do you trust people in your neighborhood?
3. To what extent do you trust people you know personally?
4. To what extent do you trust people you meet for the first time?
5. To what extent do you trust people of another religion?
6. To what extent do you trust people of another nationality?

Each respondent answers all six, so each respondent is naturally a row, and each question a column. There's no reason  to expect these six columns to be uncorrelated: someone who reports high trust in strangers of another nationality is very likely to also report relatively high trust in people they meet for the first time in general. 


With $6$ correlated columns (and, in a real survey, thousands of rows), keeping every respondent's answer to every question separately is a lot of raw data to interpret question-by-question. What we actually want is a compact summary of how many genuinely different "directions" of variation are there in these six answers. This is precisely what PCA offers us. A $6\times6$ $\Sigma$ is no longer practical to decompose by hand, but it's no different in principle from the $2\times2$ case.


<div class="callout example">
<span class="label"><span class="callout-type">Example</span></span>
Running this decomposition on the six WVS trust items (using correlations across respondents rather than raw covariances, since all six are on the same $1$–$4$ scale) might yield eigenvalues like
$$
\lambda_1\approx3.2,\ \lambda_2\approx1.3,\ \lambda_3\approx0.5,\ \lambda_4\approx0.4,\ \lambda_5\approx0.3,\ \lambda_6\approx0.3
$$
(these sum to $6$, the number of standardized variables). $\lambda_1$ alone explains $\frac{3.2}{6}\approx53\%$ of the total variance, and $\lambda_1+\lambda_2$ together explain about $75\%$, so two components, not six separate items, capture most of what these questions are telling us. The two leading eigenvectors might look like this:

<table>
<thead><tr><th>Item</th><th>Principal Component 1</th><th>Principal Component 2</th></tr></thead>
<tbody>
<tr><td>Family</td><td>0.30</td><td>0.55</td></tr>
<tr><td>Neighborhood</td><td>0.35</td><td>0.50</td></tr>
<tr><td>Known Personally</td><td>0.40</td><td>0.10</td></tr>
<tr><td>First-Time Strangers</td><td>0.45</td><td>$-0.15$</td></tr>
<tr><td>Another Religion</td><td>0.45</td><td>$-0.35$</td></tr>
<tr><td>Another Nationality</td><td>0.45</td><td>$-0.40$</td></tr>
</tbody>
</table>
</div>

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">Variance Explained</span></span>
The share of total variance captured by the $i$-th principal component is
$$
\text{Variance explained by PC}_i = \frac{\lambda_i}{\sum_{j=1}^{k}\lambda_j}
$$
and the cumulative variance explained by the first $m$ components is
$$
\text{Cumulative variance explained} = \frac{\sum_{i=1}^{m}\lambda_i}{\sum_{j=1}^{k}\lambda_j}
$$
where $k$ is the total number of variables (and thus eigenvalues). Since the denominator is the same fixed total in both cases, keeping only the first $m$ components means accepting the loss of whatever fraction of variance falls outside that sum.
</div>

## Interpreting Principal Components

An eigenvector's entries are weights, so a principal component is interpreted exactly the way we've interpreted a weighted combination all course: look at the sign and relative size of each entry.

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">Loading</span></span>
A component's loading on a given variable is that variable's entry in the corresponding eigenvector. A loading's sign tells you whether that variable moves with the component or against it; its magnitude tells you how much that variable drives the component, relative to the others.
</div>

Look at the loadings table from the six-item example. PC1's entries are all positive and roughly similar in size (0.30 to 0.45): a respondent who scores high on PC1 trusts more across every item, family included. We can interpret this as a measure of  "generalized trust."

PC2 is a bit more interesting. Family (0.55) and neighborhood (0.50) load positively, while the three out-group items (first-time strangers ($-0.15$), another religion ($-0.35$), another nationality ($-0.40$)) load negatively; trust in people known personally (0.10) sits near zero, barely tilting either way. So a respondent high on PC2 trusts close, familiar circles more than they trust outsiders; a respondent low (negative) on PC2 extends trust more evenly to strangers and out-groups. This can be read as a measure of particularized versus generalized trust.

The *labels*, though, are our interpretive layer on top of the numbers. What the eigenvectors themselves guarantee is only that PC1 and PC2 are the two directions capturing the most variance, and that they're orthogonal to each other. We are the ones who create the substantive story based on the signs and magnitudes of the loadings.
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Words of Caution</span></span>

- Sign is relative! $-\mathbf{v}$ is just as valid an eigenvector as $\mathbf{v}$ (it solves $\Sigma\mathbf{v}=\lambda\mathbf{v}$ equally well), so whether "high" on a component means one thing or its exact opposite is a labeling choice you're making, not something the math determines.
- A name for a component is your interpretation. PCA only finds directions of shared variation: it has no idea what those directions represent. Figuring out the substantive meaning of a component, if it has one at all, is work the researcher does afterward, not something the eigenvector asserts.
- A variable with bigger raw units will mechanically dominate the loadings, which is why PCA is typically run on standardized variables (a correlation matrix) rather than raw covariances.
- Components are guaranteed orthogonal by construction (the Spectral Theorem), but that's a mathematical fact about the vectors, not a guarantee that the two "ideas" they seem to represent are unrelated in any deeper sense.
</div>


## Regression vs. PCA

Both regression and PCA reduce several variables down to one number via a weighted sum, and both come from finding an eigenvector-like solution of some matrix. However, they are intended to answer fundamentally different questions about the data.

Regression's $\hat\beta$ answers: <em>which weighted combination of growth and integration best predicts democracy score?</em> It needs an outcome variable, $y$, to check its predictions against. Without $y$, there's nothing for $\hat\beta$ to be "best" at. PCA's first principal component answers: <em>which direction captures the most variation within growth and integration themselves?</em> (Or, in the trust-battery example, within the six WVS trust items themselves.) No outcome variable enters anywhere in that computation because $\Sigma$ is built purely from the predictors, with democracy score, or any downstream outcome, never mentioned.

This is also visible in what each method optimizes. $\hat\beta$ minimizes $\|y-X\beta\|^2$, or the distance to an external target. The first principal component maximizes the variance of the projected data: spread within the data's own geometry, nothing external at all. One is a supervised question (predict something), the other unsupervised (summarize something).



## Course Wrap-Up

Four sessions ago, this course opened with a USSR scholar noticing that the South Caucasus and the Baltics differed in both wealth and democracy, and, on top of that, differed in their relationship with the West. Thinking quantitatively about that observation required us to build an entire toolkit from scratch.


Session 1 gave us the raw material: vectors as data, matrices as datasets, the dot product as a weighted sum, and the geometric fact (cosine, orthogonality) that a weighted sum encodes an angle. Session 2 gave us the machinery to actually solve something built from that vocabulary: Gaussian elimination, rank, the inverse, the determinant, which are tools intended for square systems specifically. Session 3 addressed the fact that real data is never square, so we swapped "solve exactly" for "get as close as possible," derived that closeness geometrically as orthogonal projection, and derived the normal equations. In this session, we took the same variance-covariance matrix used to quantify $\hat\beta$'s uncertainty and asked what it looks like geometrically, which led straight to eigenvectors, the spectral theorem, and principal component analysis.

Linear algebra is absolutely central to quantitative political science. Any question about how variables move together (correlate, predict, cluster, reduce to a common cause) is, at its core, a question about how vectors sit relative to one another in space: their lengths, the angles between them, and the directions along which they stretch. Thinking geometrically about data, in other words, is not a niche skill for "methods people," but simply what it means to reason quantitatively about politics at all.