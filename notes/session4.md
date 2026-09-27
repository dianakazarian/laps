_Overview: We ask what a matrix actually does to space, and find that most vectors get sent in a new direction while a special few (eigenvectors) only get rescaled. We then turn this machinery on the data to distill many correlated variables down to a handful of dimensions (principal component analysis)._

<a class="resource-link" href="slides/laps_session_3.pdf" target="_blank" rel="noopener">
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
\Sigma = \begin{bmatrix} \text{Var(growth)} & \text{Cov(growth, integration)} \\\\ \text{Cov(integration, growth)} & \text{Var(integration)} \end{bmatrix}
$$
but never filled it in with numbers. Instead, we moved straight on to $\text{Var}(\hat\beta)$. This time, we will return to $\Sigma$ itself and compute it.

<div class="callout example">
<span class="label"><span class="callout-type">Example</span></span>
Using the six-country growth and integration data from Session 1, the variance-covariance matrix works out to
$$
\Sigma = \begin{bmatrix} \tfrac{18}{5} & \tfrac{31}{5} \\\\ \tfrac{31}{5} & \tfrac{377}{30} \end{bmatrix}
$$

**Eigenvalues.** As before, we solve $\det(\Sigma-\lambda I)=0$:
$$
\det(\Sigma-\lambda I) = \begin{vmatrix} \tfrac{18}{5}-\lambda & \tfrac{31}{5} \\\\ \tfrac{31}{5} & \tfrac{377}{30}-\lambda \end{vmatrix} = \left(\tfrac{18}{5}-\lambda\right)\left(\tfrac{377}{30}-\lambda\right) - \left(\tfrac{31}{5}\right)^2 = 0
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

**Eigenvector for $\lambda_1$.** Substitute $\lambda_1\approx15.73$ into $(\Sigma-\lambda_1 I)\mathbf{v}=0$ and use either row (they must agree, since $\det=0$ at an eigenvalue):
$$
\left(\tfrac{18}{5}-\lambda_1\right)v_1+\tfrac{31}{5}v_2=0 \quad\Longrightarrow\quad v_2\approx1.957\,v_1
$$
So $(1,\,1.957)$ solves the system; normalizing (dividing by its length, $\sqrt{1^2+1.957^2}\approx2.198$) gives the unit eigenvector:
$$
\mathbf{v}_1 \approx (0.455,\,0.890)
$$

**Why only one eigenvector?** By the Spectral Theorem, $\Sigma$'s two eigenvectors must be orthogonal. In two dimensions, "orthogonal to $\mathbf{v}_1$" pins down the direction of $\mathbf{v}_2$ completely — it's just $\mathbf{v}_1$ rotated $90°$, $(-0.890,\,0.455)$ — with no separate system to solve. Solving one eigenvector by hand and rotating it is enough in the $2\times2$ case; it's only once there are three or more variables that each eigenvector genuinely needs its own calculation.

</div>

<div class="callout proposition">
<span class="label"><span class="callout-type">Proposition</span></span>
The eigenvectors of $\Sigma$ point along the axes of the ellipse traced out by the data's spread; the corresponding eigenvalues measure how stretched the data is along each axis.
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
$\mathbf{v}_1$'s entries are weights on growth and integration, and we can read them the way we've read every weighted combination this course: integration's weight ($0.890$) is nearly double growth's ($0.455$), so the direction our six countries differ *most* along leans on integration more than growth. This matches the Baltics-vs-South-Caucasus story from Session 1 — those two groups don't just differ, they differ overwhelmingly along one combined axis. $\lambda_1\gg\lambda_2$ confirms it: a country's position on $\mathbf{v}_1$ alone tells you almost everything about how it compares to the rest.
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
Two variables collapsing to one dominant direction isn't especially impressive on its own — with only two variables, there was never much room to reduce. The real value of this method shows up with many correlated variables at once, where "one dominant direction" is a genuine discovery rather than a foregone conclusion. That direction, the eigenvector of $\Sigma$ with the largest eigenvalue, is given a name: the first principal component.
</div>

## Reducing Many Columns to a Few Dimensions

The real payoff of PCA shows up once there are more than two variables, and survey data is where political scientists run into this constantly. Consider a battery of questions from the World Values Survey, all asking about trust in different kinds of people:

1. To what extent do you trust people in your family?
2. To what extent do you trust people in your neighborhood?
3. To what extent do you trust people you know personally?
4. To what extent do you trust people you meet for the first time?
5. To what extent do you trust people of another religion?
6. To what extent do you trust people of another nationality?

Each respondent answers all six, so each respondent is naturally a row, and each question a column — exactly the design-matrix shape from Session 1, just with $6$ columns instead of $2$. There's no reason at all to expect these six columns to be uncorrelated: someone who reports high trust in strangers of another nationality is very likely to also report relatively high trust in people they meet for the first time in general. Whatever "trust" means to a given respondent, it seems to color several of these answers at once, not just one.

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
With $6$ correlated columns (and, in a real survey, thousands of rows), keeping every respondent's answer to every question separately is a lot of raw data to interpret question-by-question. What we actually want is a compact summary: how many genuinely different "directions" of variation are there in these six answers, and how much of each respondent's overall trust disposition can be captured by a small number of scores rather than six? This is precisely the question PCA answers. A $6\times6$ $\Sigma$ is no longer practical to decompose by hand, but it's no different in principle from the $2\times2$ case — exactly the kind of computation software like R or Python's `numpy` performs instantly.
</div>

<div class="callout example">
<span class="label"><span class="callout-type">Example</span></span>
Running this decomposition on the six WVS trust items (using correlations across respondents rather than raw covariances, since all six are on the same $1$–$4$ scale) might give eigenvalues like
$$
\lambda_1\approx3.2,\ \lambda_2\approx1.3,\ \lambda_3\approx0.5,\ \lambda_4\approx0.4,\ \lambda_5\approx0.3,\ \lambda_6\approx0.3
$$
(these sum to $6$, the number of standardized variables). $\lambda_1$ alone explains $\frac{3.2}{6}\approx53\%$ of the total variance, and $\lambda_1+\lambda_2$ together explain about $75\%$ — so two components, not six separate items, capture most of what these questions are telling us. The two leading eigenvectors might look like this:

<table>
<thead><tr><th>Item</th><th>PC1 loading</th><th>PC2 loading</th></tr></thead>
<tbody>
<tr><td>Family</td><td>0.30</td><td>0.55</td></tr>
<tr><td>Neighborhood</td><td>0.35</td><td>0.50</td></tr>
<tr><td>Known personally</td><td>0.40</td><td>0.10</td></tr>
<tr><td>First-time strangers</td><td>0.45</td><td>$-0.15$</td></tr>
<tr><td>Another religion</td><td>0.45</td><td>$-0.35$</td></tr>
<tr><td>Another nationality</td><td>0.45</td><td>$-0.40$</td></tr>
</tbody>
</table>
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
It's worth seeing why this can't be done by hand, even in principle. $\Sigma$ here is a $6\times6$ correlation matrix (diagonal entries $=1$, since each item is standardized; off-diagonals are the pairwise correlations $\rho_{ij}$ between items):
$$
\Sigma - \lambda I = \begin{bmatrix}
1-\lambda & \rho_{12} & \rho_{13} & \rho_{14} & \rho_{15} & \rho_{16} \\\\
\rho_{12} & 1-\lambda & \rho_{23} & \rho_{24} & \rho_{25} & \rho_{26} \\\\
\rho_{13} & \rho_{23} & 1-\lambda & \rho_{34} & \rho_{35} & \rho_{36} \\\\
\rho_{14} & \rho_{24} & \rho_{34} & 1-\lambda & \rho_{45} & \rho_{46} \\\\
\rho_{15} & \rho_{25} & \rho_{35} & \rho_{45} & 1-\lambda & \rho_{56} \\\\
\rho_{16} & \rho_{26} & \rho_{36} & \rho_{46} & \rho_{56} & 1-\lambda
\end{bmatrix}
$$
Setting $\det(\Sigma-\lambda I)=0$ and expanding this determinant is exactly the same kind of computation as the $2\times2$ case — just fifteen correlations instead of one — but the result is a degree-$6$ polynomial in $\lambda$. Using the eigenvalues from the example above as its roots, it works out to
$$
\lambda^6 - 6\lambda^5 + 11.74\lambda^4 - 10.18\lambda^3 + 4.38\lambda^2 - 0.92\lambda + 0.07 = 0
$$
Where the $2\times2$ case reduced to a quadratic, solvable directly with the quadratic formula, no such formula exists for a degree-$6$ polynomial: by the Abel–Ruffini theorem, polynomials of degree $5$ or higher have no general algebraic solution at all. This isn't a matter of the arithmetic being tedious — there's no formula to grind through, regardless of patience. Software doesn't solve this polynomial symbolically either; it finds the eigenvalues numerically, directly from $\Sigma$, which is why a single line (`eigen(Sigma)` in R, `numpy.linalg.eig(Sigma)` in Python) returns all six eigenvalues and eigenvectors instantly, no matter how many variables are involved.
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
This is what "latent dimension" means: none of the six original questions *is* PC1, and PC1 was never labeled "generalized trust" by anything in the data — that label is ours to propose, not something the eigenvector asserts. Read the loadings the way we've read every eigenvector so far: PC1's are all positive and roughly similar in size, so a respondent who trusts more, trusts more across the board — this is the dominant axis, exactly as $\lambda_1\gg\lambda_2$ suggested it would be.

PC2 is more interesting: family and neighborhood load positively, while the three out-group items (strangers, another religion, another nationality) load negatively, with trust in people known personally sitting near zero in between. PC2 separates respondents who trust close, familiar circles but not outsiders from respondents whose trust extends more evenly to strangers and out-groups — a distinction political scientists studying trust already have a name for: particularized versus generalized trust. PCA didn't know that literature existed; it only found that this is the second-largest direction along which respondents' answers actually vary. That the result lines up with an established theoretical distinction is a genuinely useful check on that theory — but, as before, the *label* "particularized vs. generalized trust" is the researcher's interpretive layer on top of a computation that only ever saw six correlated numbers per respondent.
</div>

## Interpreting Principal Components

An eigenvector's entries are weights, so a PC is interpreted exactly the way we've interpreted a weighted combination all course: look at the sign and relative size of each entry.

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
For our two-variable $\mathbf{v}_1\approx(0.455,\,0.890)$: both entries are positive, so higher growth and higher integration both push a country in the same direction along PC1 — countries don't trade one off against the other on this axis, they move together. The relative sizes say integration carries more of the weight. As with the WVS trust example above, it's tempting to name this axis something like "reform intensity" — but that label is the researcher's interpretive choice, layered on top of a computation that has no idea what growth or integration substantively mean.

Two things to watch for when interpreting a PC in practice:
- **Sign is only relative.** $-\mathbf{v}_1$ is an equally valid eigenvector (it solves $\Sigma\mathbf{v}=\lambda\mathbf{v}$ just as well), so whether high PC1 means "more reform" (or "more generalized trust") or the reverse is a labeling choice, not something the math determines.
- **Scale matters before you even get to $\Sigma$.** A variable measured in bigger raw units (GDP per capita in dollars, say, versus a 1–4 survey scale) will dominate the variance and can hijack PC1 for reasons that have nothing to do with substantive importance — which is why PCA is usually run on standardized (unit-variance) variables in practice.
</div>

## Regression vs. PCA

Both regression and PCA reduce several variables down to one number via a weighted sum, and both come from finding an eigenvector-like solution of some matrix. It's worth being precise about how they differ, since it's easy to conflate them.

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
Regression's $\hat\beta$ answers: <em>which weighted combination of growth and integration best predicts democracy score?</em> It needs an outcome variable, $y$, to check its predictions against — without $y$, there's nothing for $\hat\beta$ to be "best" at. PCA's first principal component answers a different question entirely: <em>which direction captures the most variation within growth and integration themselves?</em> (Or, in the trust-battery example, within the six WVS trust items themselves.) No outcome variable enters anywhere in that computation — $\Sigma$ is built purely from the predictors, with democracy score, or any downstream outcome, never mentioned.
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
This is also visible in what each method optimizes. $\hat\beta$ minimizes $\|y-X\beta\|^2$ — distance to an external target. The first principal component maximizes the variance of the projected data — spread within the data's own geometry, nothing external at all. One is a supervised question (predict something), the other unsupervised (summarize something) — and it's not a coincidence that both reduce to solving an eigenvalue-flavored problem with a symmetric matrix ($X^\top X$ for regression, $\Sigma$ for PCA): whenever a question reduces to "find the best single direction," a symmetric matrix and its eigenvectors tend to be exactly the tool that answers it.
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
For the scholar's specific project, this distinction has a direct payoff: PCA is the right tool for building a defensible <em>index</em> (Western alignment, say, as a single composite variable to use elsewhere — or a "generalized trust" score built from the six WVS items above), while regression is the right tool for asking whether that index, or its component variables, actually <em>predicts</em> something of interest, like democratization, or whether generalized trust predicts institutional support. They are not competing methods for the same question — they are the correct methods for two genuinely different questions, and a lot of applied confusion comes from reaching for one when the other is what the question actually calls for.
</div>


## Course Wrap-Up

Four sessions ago, this course opened with a USSR scholar noticing that the South Caucasus and the Baltics differed in both wealth and democracy — and, on top of that, differed in their relationship with the West. Answering the question that observation raised turned out to require building an entire toolkit from scratch, one piece at a time, each piece introduced exactly when the story needed it rather than all at once up front.


Session 1 gave the raw material: vectors as data, matrices as datasets, the dot product as a weighted sum, and the geometric fact — cosine, orthogonality — that a weighted sum secretly encodes an angle. Session 2 gave the machinery to actually solve something built from that vocabulary: Gaussian elimination, rank, the inverse, the determinant — tools for square systems specifically. Session 3 closed the gap those tools left open: real data is never square, so we swapped "solve exactly" for "get as close as possible," derived that closeness geometrically as orthogonal projection, and watched it collapse into the normal equations — the exact same square-system machinery from Session 2, applied to $X^\top X$ instead of $X$ itself. This session took the same variance-covariance matrix used to quantify $\hat\beta$'s uncertainty and asked what it looks like geometrically, which led straight to eigenvectors, the spectral theorem, and principal component analysis.


<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
Notice how rarely a genuinely new mathematical object was introduced after Session 1. Nearly everything since has been the same handful of ideas — the dot product, the transpose, $M^\top M$'s symmetry, the determinant — recombined and reapplied to a new question. The normal equations were session 2's inverse, aimed at $X^\top X$. Standard errors were the same $(X^\top X)^{-1}$, reused. PCA's eigenvectors were the same symmetric-matrix machinery that made the normal equations solvable in the first place, pointed at $\Sigma$ instead. Linear algebra earns its place in a political scientist's toolkit precisely because of this reuse: a small, fixed set of operations turns out to answer a surprisingly wide range of applied questions.
</div>
