_Overview: Forthcoming._

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

## Symmetric Matrices Are Special

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

The reason this matters for us specifically: $\Sigma$, the variance-covariance matrix from Session 3, is symmetric — a fact we already used there, without proof, to justify $\text{Var}(\hat\beta)=\sigma^2(X^\top X)^{-1}$'s own symmetry. The Spectral Theorem is what actually backs that up: real eigenvalues, orthogonal eigenvectors, guaranteed. In Session 3 we only ever applied $\Sigma$'s machinery to $\hat\beta$'s uncertainty. Next, we turn it back on the data itself — growth and integration — and see what its eigenvectors and eigenvalues mean there.


## Principal Component Analysis

Session 3 defined $\Sigma$ in general but only ever applied it to $\text{Var}(\hat\beta)$, the uncertainty of our coefficient estimates. We now turn the same machinery back on the data itself — growth and EU integration across our six countries — and ask what its eigenvectors and eigenvalues mean there.

<div class="callout example">
<span class="label"><span class="callout-type">Example</span></span>
Using the six-country growth and integration data from Session 1, the variance-covariance matrix works out to
$$
\Sigma = \begin{bmatrix} \tfrac{18}{5} & \tfrac{31}{5} \\\\ \tfrac{31}{5} & \tfrac{377}{30} \end{bmatrix}
$$
$\Sigma$ is symmetric, exactly as the Spectral Theorem requires — so its eigenvalues are guaranteed real and its eigenvectors are guaranteed orthogonal. Solving for them:
$$
\lambda_1\approx15.73,\qquad \lambda_2\approx0.43,\qquad \mathbf{v}_1\approx(0.455,\,0.890)
$$
</div>

<div class="callout proposition">
<span class="label"><span class="callout-type">Proposition</span></span>
The eigenvectors of $\Sigma$ point along the axes of the ellipse traced out by the data's spread; the corresponding eigenvalues measure how stretched the data is along each axis.
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
$\mathbf{v}_1$'s entries are weights on growth and integration, and we can read them the way we've read every weighted combination this course: integration's weight ($0.890$) is nearly double growth's ($0.455$), so the direction our six countries differ *most* along leans on integration more than growth. This matches the Baltics-vs-South-Caucasus story from Session 1 — those two groups don't just differ, they differ overwhelmingly along one combined axis. $\lambda_1\gg\lambda_2$ confirms it: a country's position on $\mathbf{v}_1$ alone tells you almost everything about how it compares to the rest.
</div>

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">First Principal Component</span></span>
The first principal component (PC1) of a dataset is the eigenvector of $\Sigma$ corresponding to its largest eigenvalue — the single direction along which the data varies the most. A given observation's <em>score</em> on PC1 is its position along that direction: the dot product of its (centered) values with $\mathbf{v}_1$.
</div>

<div class="callout example">
<span class="label"><span class="callout-type">Example</span></span>
Centering each country's growth and integration values around the six-country means ($\bar g=5$, $\bar\iota\approx5.17$) and scoring each against $\mathbf{v}_1\approx(0.455,\,0.890)$:

<table>
<thead><tr><th>Country</th><th>Growth</th><th>Integration</th><th>PC1 Score</th></tr></thead>
<tbody>
<tr><td>Armenia</td><td>3</td><td>2</td><td>$-3.73$</td></tr>
<tr><td>Azerbaijan</td><td>4</td><td>1</td><td>$-4.16$</td></tr>
<tr><td>Georgia</td><td>3</td><td>3</td><td>$-2.84$</td></tr>
<tr><td>Latvia</td><td>7</td><td>9</td><td>$4.32$</td></tr>
<tr><td>Lithuania</td><td>6</td><td>8</td><td>$2.98$</td></tr>
<tr><td>Estonia</td><td>7</td><td>8</td><td>$3.43$</td></tr>
</tbody>
</table>

A single number per country, and it cleanly separates the two groups: every South Caucasus country scores negative, every Baltic country scores positive. Two columns of data have been compressed into one, with essentially nothing lost.
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
Recall the very first index our scholar built back in Session 1: an arbitrary $0.5(\text{growth})+0.5(\text{integration})$, chosen only because equal weights seemed like a reasonable default. PC1 is a weighted combination of the exact same two variables — but the weights $(0.455,\,0.890)$ are not a guess. They are the unique weights that make the resulting index vary as much as possible across countries, derived directly from $\Sigma$. Where Session 1 picked weights out of convenience, PCA picks the weights that squeeze the most information out of the data.
</div>

## Regression vs. PCA

Both regression and PCA reduce several variables down to one number via a weighted sum, and both come from finding an eigenvector-like solution of some matrix. It's worth being precise about how they differ, since it's easy to conflate them.

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
Regression's $\hat\beta$ answers: <em>which weighted combination of growth and integration best predicts democracy score?</em> It needs an outcome variable, $y$, to check its predictions against — without $y$, there's nothing for $\hat\beta$ to be "best" at. PCA's first principal component answers a different question entirely: <em>which direction captures the most variation within growth and integration themselves?</em> No outcome variable enters anywhere in that computation — $\Sigma$ is built purely from the predictors, with democracy score never mentioned.
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
This is also visible in what each method optimizes. $\hat\beta$ minimizes $\|y-X\beta\|^2$ — distance to an external target. The first principal component maximizes the variance of the projected data — spread within the data's own geometry, nothing external at all. One is a supervised question (predict something), the other unsupervised (summarize something) — and it's not a coincidence that both reduce to solving an eigenvalue-flavored problem with a symmetric matrix ($X^\top X$ for regression, $\Sigma$ for PCA): whenever a question reduces to "find the best single direction," a symmetric matrix and its eigenvectors tend to be exactly the tool that answers it.
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
For the scholar's specific project, this distinction has a direct payoff: PCA is the right tool for building a defensible <em>index</em> (Western alignment, say, as a single composite variable to use elsewhere), while regression is the right tool for asking whether that index, or its component variables, actually <em>predicts</em> something of interest, like democratization. They are not competing methods for the same question — they are the correct methods for two genuinely different questions, and a lot of applied confusion comes from reaching for one when the other is what the question actually calls for.
</div>

## Reducing Many Columns to a Few Dimensions

The real payoff of PCA shows up once there are more than two variables. Suppose our USSR scholar adds two more measures to the dataset: trade openness and civil-society strength, alongside growth and EU integration. Four columns now describe each country, and $\Sigma$ is $4\times4$.

<div class="callout example">
<span class="label"><span class="callout-type">Example</span></span>
Across our six countries, growth, integration, trade openness, and civil-society strength all tend to rise and fall together — the Baltics score high on all four, the South Caucasus low on all four. Decomposing the resulting $4\times4$ $\Sigma$ gives eigenvalues like
$$
\lambda_1\approx 3.1,\quad \lambda_2\approx 0.6,\quad \lambda_3\approx 0.2,\quad \lambda_4\approx 0.1
$$
$\lambda_1$ alone accounts for roughly $\frac{3.1}{3.1+0.6+0.2+0.1}\approx 78\%$ of the total variance in the data. Four separate measurements collapse almost entirely onto a single number, PC1, without us ever telling the method that these four things were "supposed to" measure the same underlying thing.
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
This is what "latent dimension" means: none of the four original columns *is* PC1, and PC1 was never labeled "reform" or "liberalization" by anything in the data. PCA only sees numbers moving together; it has no idea what those numbers represent. The moment four measured columns compress down to one dominant axis, it becomes tempting to say we've "found" an underlying construct like reform. That's a substantive claim the researcher is making, not something the eigenvector proves on its own — a point we return to below.
</div>

## Interpreting Principal Components

An eigenvector's entries are weights, so a PC is interpreted exactly the way we've interpreted a weighted combination all course: look at the sign and relative size of each entry.

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
For our two-variable $\mathbf{v}_1\approx(0.455,\,0.890)$: both entries are positive, so higher growth and higher integration both push a country in the same direction along PC1 — countries don't trade one off against the other on this axis, they move together. The relative sizes say integration carries more of the weight. A natural label for this axis might be something like "reform intensity," but that label is an interpretive choice the researcher is layering on top of the math, not a fact the eigenvector asserts.

Two things to watch for when interpreting a PC in practice:
- **Sign is only relative.** $-\mathbf{v}_1$ is an equally valid eigenvector (it solves $\Sigma\mathbf{v}=\lambda\mathbf{v}$ just as well) so whether high PC1 means "more reform" or "less reform" is a labeling choice, not something the math determines.
- **Scale matters before you even get to $\Sigma$.** A variable measured in bigger raw units (say, GDP per capita in dollars rather than a 0–10 index) will dominate the variance and can hijack PC1 for reasons that have nothing to do with substantive importance. This is why PCA is usually run on standardized (unit-variance) variables in practice — a caveat worth flagging to students even without deriving standardization here.
</div>
## Course Wrap-Up

Four sessions ago, this course opened with a USSR scholar noticing that the South Caucasus and the Baltics differed in both wealth and democracy — and, on top of that, differed in their relationship with the West. Answering the question that observation raised turned out to require building an entire toolkit from scratch, one piece at a time, each piece introduced exactly when the story needed it rather than all at once up front.

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span> <span class="callout-title">The arc, in one pass</span></span>
Session 1 gave the raw material: vectors as data, matrices as datasets, the dot product as a weighted sum, and the geometric fact — cosine, orthogonality — that a weighted sum secretly encodes an angle. Session 2 gave the machinery to actually solve something built from that vocabulary: Gaussian elimination, rank, the inverse, the determinant — tools for square systems specifically. Session 3 closed the gap those tools left open: real data is never square, so we swapped "solve exactly" for "get as close as possible," derived that closeness geometrically as orthogonal projection, and watched it collapse into the normal equations — the exact same square-system machinery from Session 2, applied to $X^\top X$ instead of $X$ itself. This session took the same variance-covariance matrix used to quantify $\hat\beta$'s uncertainty and asked what it looks like geometrically, which led straight to eigenvectors, the spectral theorem, and principal component analysis.
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
Notice how rarely a genuinely new mathematical object was introduced after Session 1. Nearly everything since has been the same handful of ideas — the dot product, the transpose, $M^\top M$'s symmetry, the determinant — recombined and reapplied to a new question. The normal equations were session 2's inverse, aimed at $X^\top X$. Standard errors were the same $(X^\top X)^{-1}$, reused. PCA's eigenvectors were the same symmetric-matrix machinery that made the normal equations solvable in the first place, pointed at $\Sigma$ instead. Linear algebra earns its place in a political scientist's toolkit precisely because of this reuse: a small, fixed set of operations turns out to answer a surprisingly wide range of applied questions.
</div>
