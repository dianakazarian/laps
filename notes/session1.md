_Overview: We introduce vectors and matrices as the raw material of (political science) data. We then learn how to operate the heavy machinery that transforms them._

## Motivation: Why Study Linear Algebra?

Many questions in political science result from a conviction that multiple things are related to one another. A scholar specializing in the USSR, for example, might notice that the countries of the South Caucasus (Armenia, Azerbaijan, and Georgia), have both weak economies and weak democracies, while the countries of the Baltics (Estonia, Latvia, and Lithuania), have strong(er) economies and strong(er) democracies. He has arrived at one of the classic questions in comparative politics: Why does sustained economic growth seem to increase the likelihood of democratization?


But, this scholar notes, the Baltics and the South Caucasus also differ in a third way: proximity to the West. The Baltics were fast-tracked into EU accession; the South Caucasus states largely were not. So is economic growth really driving democratization, or are both being pulled along by a country's relationship with the West? At this point, the scholar may start collecting some preliminary data.

<table>
<thead>
<tr><th>Country</th><th>Region</th><th>GDP Growth</th><th>EU Integration</th><th>Democracy Score</th></tr>
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

Ultimately, our scholar wants to know the following things:
1. How much does **GDP Growth** influence **Democracy Score**?
2. How much does **EU Integration** influence **Democracy Score**?
3. How much does **GDP Growth** influence **Democracy Score**, when **EU Integration** is held constant?

He should be patient. We will get there. In the meantime, take a look at the following object.

$$
A = 
\begin{bmatrix}
3 & 2 & 3 \\
4 & 1 & 2 \\
3 & 3 & 4 \\
7 & 9 & 8 \\
6 & 8 & 7 \\
7 & 8 & 8
\end{bmatrix}

$$

You will notice that $A$ contains exactly the numbers from the table above. Once we've stripped away the country names and the region labels, what remains is a rectangular grid of numbers, one row per country, one column per variable. This grid is called a **matrix**. It didn't require any new mathematics to produce; it was sitting inside the table the whole time! Indeed, all datasets in a tabular format are matrices.

This turns out to matter a great deal. The scholar's three questions about the world are actually questions about this  matrix $A$. In particular: how do the *columns* of $A$ relate to one another? Does the growth column move together with the democracy column? And does that relationship survive once the EU integration column is accounted for? In order to obtain precise quantitative answers to questions like these, we need to be able to isolate a single column, combine columns together, and compare one column's movement against another's. A single column of a matrix, on its own, is exactly what we will soon call a **vector**.

So the plan for the next four sessions is this: before we can answer *why* growth and democracy move together, or *whether* EU integration explains it away, we need a working vocabulary for objects like $A$ and its columns. Vectors and matrices are the two fundamental objects of linear algebra. Once we know how to manipulate them, combine them, and eventually solve for unknowns using them, we will be able to answer precisely how much weight each column deserves in explaining the last one.

## Vectors

Recall the matrix $A$ from before: six countries, three columns of numbers. Take just one column on its own, say the GDP growth column:

$$
\mathbf{x} = \begin{bmatrix} 3 \\ 4 \\ 3 \\ 7 \\ 6 \\ 7 \end{bmatrix}
$$

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span>  <span class="callout-title">Vector</span></span>
A vector is an ordered list of numbers. We write vectors as lowercase bold letters ($\mathbf{x}$) and their individual entries with subscripts ($x_1, x_2, \dots, x_n$). A vector with $n$ entries is said to have <em>dimension</em> $n$, or to live in $\mathbb{R}^n$.
</div>

$\mathbf{x}$ is simply the GDP growth column, isolated from the rest of the table. This is the first thing worth internalizing about vectors: in political science, a vector is very often just *one variable, across every observation in your dataset*. The democracy score column is a vector. The EU integration column is a vector. Even a single country's full profile (reading across a row instead of down a column) is a vector:

$$
\mathbf{a}_{\text{Armenia}} = \begin{bmatrix} 3 \\ 2 \\ 3 \end{bmatrix}
$$

## Matrices

We have already met $A$: the six-country, three-variable table from the introduction. Now, more precisely:

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">Matrix</span></span>
A matrix is a rectangular array of numbers, arranged in rows and columns. We write matrices as uppercase letters ($A$), and refer to the size of a matrix as $m \times n$, meaning $m$ rows and $n$ columns. The entry in row $i$, column $j$ is written $a_{ij}$.
</div>

$$
A = 
\begin{bmatrix}
3 & 2 & 3 \\
4 & 1 & 2 \\
3 & 3 & 4 \\
7 & 9 & 8 \\
6 & 8 & 7 \\
7 & 8 & 8
\end{bmatrix}
$$

$A$ is $6 \times 3$: six rows (one per country), three columns (one per variable). The entry $a_{42} = 9$ is the value in row 4, column 2 (Estonia's EU integration score).

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
A matrix is a collection of vectors, side by side. $A$'s three columns are three vectors in $\mathbb{R}^6$; $A$'s six rows are six vectors in $\mathbb{R}^3$. A vector, in fact, is just a matrix with only one column ($n=1$), which is why it's common to see a vector written as an $n \times 1$ matrix.
</div>

## Vector Operations: Addition and Scalar Multiplication

Two vectors of the same dimension can be added, entry by entry.

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">Vector Addition</span></span>
If $\mathbf{u} = \begin{bmatrix} u_1 \\ \vdots \\ u_n \end{bmatrix}$ and $\mathbf{v} = \begin{bmatrix} v_1 \\ \vdots \\ v_n \end{bmatrix}$, then
$$
\mathbf{u} + \mathbf{v} = \begin{bmatrix} u_1 + v_1 \\ \vdots \\ u_n + v_n \end{bmatrix}
$$
Addition is only defined when $\mathbf{u}$ and $\mathbf{v}$ have the same number of entries.
</div>

<div class="callout example">
<span class="label"><span class="callout-type">Example</span> Vector Addition</span>
Call the GDP Growth and EU Integration column vectors $\mathbf{x}_1$ and $\mathbf{x}_2$, respectively, and add them together.

<details class="collapsible">
<summary>Solution</summary>

$$
\mathbf{x}_1 = \begin{bmatrix} 3 \\ 4 \\ 3 \\ 7 \\ 6 \\ 7 \end{bmatrix}, \qquad
\mathbf{x}_2 = \begin{bmatrix} 2 \\ 1 \\ 3 \\ 9 \\ 8 \\ 8 \end{bmatrix}
$$
$$
\implies \mathbf{x}_1 + \mathbf{x}_2 = \begin{bmatrix} 5 \\ 5 \\ 6 \\ 16 \\ 14 \\ 15 \end{bmatrix}
$$
This is a real (if crude) composite score: each country's growth and integration values summed together. Whether that sum is a *meaningful* quantity is a modeling question, not a mathematical one; the operation itself is unambiguous.
</div>
</div>
</details>

A vector can also be rescaled by an ordinary number.

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">Scalar Multiplication</span></span>
For a number $c$ (called a <em>scalar</em> to distinguish it from a vector) and a vector $\mathbf{v}$,
$$
c\mathbf{v} = \begin{bmatrix} cv_1 \\ \vdots \\ cv_n \end{bmatrix}
$$
</div>

<div class="callout example">
<span class="label"><span class="callout-type">Example</span> Scalar Multiplication</span>
If the democracy score were instead reported on a 0–20 scale rather than 0–10, every entry would simply double: $2\mathbf{y}$, where $\mathbf{y}$ is the original democracy score column. Rescaling a variable (e.g., converting units, standardizing, normalizing to a 0–1 range) is scalar multiplication. We could also combine this with addition, to shift the values as well as stretch them. Once again, this is more a modeling question than a mathematical one.
</div>

## The Dot Product


<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span>  <span class="callout-title">Dot Product</span></span>
For two vectors of the same dimension, $\mathbf{u} = \begin{bmatrix} u_1 \\ \vdots \\ u_n \end{bmatrix}$ and $\mathbf{v} = \begin{bmatrix} v_1 \\ \vdots \\ v_n \end{bmatrix}$,
$$
\mathbf{u} \cdot \mathbf{v} = \sum_{i=1}^n u_iv_i = u_1v_1 + u_2v_2 + \cdots + u_nv_n
$$
Multiply corresponding entries, then add up the results. Like addition, the dot product is only defined when both vectors have the same number of entries.
</div>

<div class="callout example">
<span class="label"><span class="callout-type">Example</span>  <span class="callout-title">A Weighted Composite</span></span>
Calculate the dot product of the GDP Growth and EU Integration columns.
<details class="collapsible">
<summary>Solution</summary>
$$
\mathbf{x}_1 = \begin{bmatrix} 3 \\ 4 \\ 3 \\ 7 \\ 6 \\ 7 \end{bmatrix}, \qquad
\mathbf{x}_2 = \begin{bmatrix} 2 \\ 1 \\ 3 \\ 9 \\ 8 \\ 8 \end{bmatrix}
$$
$$
\mathbf{x}_1 \cdot \mathbf{x}_2 = (3)(2) + (4)(1) + (3)(3) + (7)(9) + (6)(8) + (7)(8) = 6+4+9+63+48+56 = 186
$$
On its own, 186 isn't a quantity with an obvious substantive meaning—but hold that thought! The dot product's real use is not computing one number in isolation, but what happens when one of the two vectors is a set of *weights*. This will make sense soon.
</div>
<div class="callout example">
<span class="label"><span class="callout-type">Example</span> <span class="callout-title">A Single Country's Weighted Score</span></span>
Suppose we want to combine a country's growth and EU integration into one composite index, giving growth twice the weight of integration. Write that choice as a weight vector, $\mathbf{w} = \begin{bmatrix} 2 \\ 1 \end{bmatrix}$. For Georgia, whose growth and integration values are $\begin{bmatrix} 3 \\ 3 \end{bmatrix}$:
$$
\mathbf{w} \cdot \begin{bmatrix} 3 \\ 3 \end{bmatrix} = (2)(3) + (1)(3) = 9
$$
Every entry of the data vector got multiplied by its corresponding weight, and the results were summed into a single composite number for Georgia. This is the pattern to hold onto: a dot product between a weight vector and a data vector produces one weighted combination.
</div>

## Geometric Implications of the Dot Product

Beyond serving as a weighted sum, the dot product also carries information about how two vectors relate to each other in space. To see this, we first need a way to measure a vector's own size.

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">Vector Norm (Length)</span></span>
The norm (or length) of a vector $\mathbf{v}$ is
$$
\|\mathbf{v}\| = \sqrt{\mathbf{v} \cdot \mathbf{v}} = \sqrt{v_1^2 + v_2^2 + \cdots + v_n^2}
$$
This is simply the dot product of a vector with itself (square-rooted). It is a direct generalization of the Pythagorean theorem to $n$ dimensions.
</div>

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span>  <span class="callout-title">Dot Products and Angles</span></span>
For any two vectors $\mathbf{u}, \mathbf{v}$,
$$
\mathbf{u} \cdot \mathbf{v} = \|\mathbf{u}\|\|\mathbf{v}\|\cos\theta
$$
where $\theta$ is the angle between them. Equivalently,
$$
\cos\theta = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\|\|\mathbf{v}\|}
$$
</div>


This is what the dot product is really measuring: not just a weighted sum, but how aligned two vectors are. $\cos\theta$ close to $1$ means the vectors point in nearly the same direction; close to $0$ means they're roughly perpendicular (unrelated); close to $-1$ means they point in nearly opposite directions.


<div class="callout example">
<span class="label"><span class="callout-type">Example</span> <span class="callout-title">How Aligned are Growth and Democracy?</span></span>
Calculate the angle between the GDP Growth and Democracy Score columns of $A$.

<details class="collapsible">
<summary>Solution</summary>
$$
\mathbf{x}_1 = \begin{bmatrix} 3 \\ 4 \\ 3 \\ 7 \\ 6 \\ 7 \end{bmatrix}, \qquad
\mathbf{x}_2 = \begin{bmatrix} 3 \\ 2 \\ 4 \\ 8 \\ 7 \\ 8 \end{bmatrix}
$$
$$
\mathbf{x}_1 \cdot \mathbf{x}_2 = 9+8+12+56+42+56 = 183
$$
$$
\|\mathbf{x}_1\| = \sqrt{9+16+9+49+36+49} = \sqrt{168} \approx 12.96, \qquad
\|\mathbf{x}_2\| = \sqrt{9+4+16+64+49+64} = \sqrt{206} \approx 14.35
$$
$$
\cos\theta = \frac{183}{(12.96)(14.35)} \approx 0.984
$$
We take the inverse cosine to see that this corresponds to an angle of about $10^\circ$, meaning the two vectors point in nearly the same direction. Geometrically, this is what it looks like for two variables to move together: as columns of numbers, growth and democracy trace out almost the same shape across the six countries.
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
This is not a coincidence, and not unrelated to statistics you may already know: $\cos\theta$ between two variables' columns, once each column has been centered (its mean subtracted off), is exactly the Pearson correlation coefficient.
</div>

## Matrix-Vector Multiplication

Example 1.4 computed a weighted composite score for Georgia alone. But our scholar has six countries, not just one, and recomputing that dot product by hand, country by country, is exactly the kind of repetition vectors and matrices exist to eliminate.

Collect the growth and EU integration columns side by side into a $6 \times 2$ matrix:

$$
M = 
\begin{bmatrix}
3 & 2 \\
4 & 1 \\
3 & 3 \\
7 & 9 \\
6 & 8 \\
7 & 8
\end{bmatrix}
$$

Each row of $M$ is one country's (growth, integration) pair: the same pair Example 1.4 dotted with $\mathbf{w} = \begin{bmatrix} 2 \\ 1 \end{bmatrix}$ for Georgia alone. Matrix-vector multiplication is what happens when you do that same dot product against *every row at once*.

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span>  <span class="callout-title">Matrix-Vector Multiplication</span></span>
For an $m \times n$ matrix $M$ and an $n \times 1$ vector $\mathbf{w}$, the product $M\mathbf{w}$ is the $m \times 1$ vector whose $i$-th entry is the dot product of $M$'s $i$-th row with $\mathbf{w}$:
$$
(M\mathbf{w})_i = \sum_{j=1}^n M_{ij}w_j
$$
This is only defined when the number of columns in $M$ matches the number of entries in $\mathbf{w}$ — each row needs a matching weight to dot against.
</div>

<div class="callout example">
<span class="label"><span class="callout-type">Example</span>  <span class="callout-title">A Composite Score for Every Country, At Once</span></span>
$$
M\mathbf{w} = 
\begin{bmatrix}
3 & 2 \\
4 & 1 \\
3 & 3 \\
7 & 9 \\
6 & 8 \\
7 & 8
\end{bmatrix}
\begin{bmatrix} 2 \\ 1 \end{bmatrix}
=
\begin{bmatrix}
(3)(2)+(2)(1) \\
(4)(2)+(1)(1) \\
(3)(2)+(3)(1) \\
(7)(2)+(9)(1) \\
(6)(2)+(8)(1) \\
(7)(2)+(8)(1)
\end{bmatrix}
=
\begin{bmatrix} 8 \\ 9 \\ 9 \\ 23 \\ 20 \\ 22 \end{bmatrix}
$$
Notice the third entry, 9 (Georgia's composite score) matches Example 1.4 exactly. Nothing new was computed; six dot products that we'd otherwise have written out separately were performed in one line, against the same weight vector $\mathbf{w}$.
</div>

## Matrix-Matrix Multiplication

Matrix-vector multiplication ($M\mathbf{w}$) applies one weight vector to every row of $M$ at once. A natural next question: what if we wanted to try *several* weight vectors simultaneously—for example, one composite index that weights growth twice as heavily as integration, and a second index that weights them equally?

Instead of computing $M\mathbf{w}_1$ and $M\mathbf{w}_2$ separately, stack the two weight vectors side by side as columns of a matrix $W$, and apply both at once.

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">Matrix-Matrix Multiplication</span></span>
For an $m \times n$ matrix $M$ and an $n \times p$ matrix $W$, the product $MW$ is the $m \times p$ matrix whose $(i,k)$ entry is the dot product of $M$'s $i$-th row with $W$'s $k$-th column:
$$
(MW)_{ik} = \sum_{j=1}^n M_{ij}W_{jk}
$$
Each column of $MW$ is exactly what matrix-vector multiplication would have produced using that column of $W$ alone. Multiplying by a matrix is nothing more than multiplying by several vectors, side by side, at once.
</div>

<div class="callout example">
<span class="label"><span class="callout-type">Example</span> <span class="callout-title">Two Composite Indices, At Once</span></span>
Take $M$ (growth and integration, from before) and let $W$'s two columns be the two weighting schemes:
$$
W = \begin{bmatrix} 2 & 1 \\ 1 & 1 \end{bmatrix}
$$
(column 1: weight growth twice integration; column 2: weight them equally.) Then
$$
MW = \begin{bmatrix} 3 & 2 \\ 4 & 1 \\ 3 & 3 \\ 7 & 9 \\ 6 & 8 \\ 7 & 8 \end{bmatrix}\begin{bmatrix} 2 & 1 \\ 1 & 1 \end{bmatrix} = \begin{bmatrix} 8 & 5 \\ 9 & 5 \\ 9 & 6 \\ 23 & 16 \\ 20 & 14 \\ 22 & 15 \end{bmatrix}
$$
</div>

<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
Matrix multiplication is only defined when the number of columns in the first matrix matches the number of rows in the second.
</div>

## Matrix Operations: The Transpose
<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">Transpose</span></span>
The transpose of an $m \times n$ matrix $M$, written $M^\top$, is the $n \times m$ matrix obtained by turning $M$'s rows into columns (equivalently, its columns into rows): $(M^\top)_{ij} = M_{ji}$.
</div>
<div class="callout remark">
<span class="label"><span class="callout-type">Remark</span></span>
The transpose reverses order when applied to a product: for compatible matrices $A$ and $B$,
$$
(AB)^\top = B^\top A^\top
$$
Notice the swap: it's not $A^\top B^\top$. This will matter later whenever we need to transpose an expression built out of several matrices multiplied together (for instance, unpacking something like $(MW)^\top$ requires transposing $W$ and $M$ individually, and reversing their order).
</div>

<div class="callout example">
<span class="label"><span class="callout-type">Example</span> </span>
$$
M = \begin{bmatrix} 3 & 2 \\ 4 & 1 \\ 3 & 3 \end{bmatrix}, \qquad M^\top = \begin{bmatrix} 3 & 4 & 3 \\ 2 & 1 & 3 \end{bmatrix}
$$
$M$ is $3\times 2$; $M^\top$ is $2\times 3$.
</div>


## Special Classes of Matrices

Certain matrices come up often enough, and behave predictably enough, that they are worth naming individually.

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">Identity Matrix</span></span>
The $n \times n$ diagonal matrix with every $d_i = 1$, denoted $I$ (or $I_n$ when the dimension needs to be made explicit):
$$
I = \begin{bmatrix}
1 & 0 & \cdots & 0 \\
0 & 1 & \cdots & 0 \\
\vdots & \vdots & \ddots & \vdots \\
0 & 0 & \cdots & 1
\end{bmatrix}
$$
$I$ satisfies $IM = M$ and $MI = M$ for any compatible matrix $M$. It plays the same role among matrices that the number $1$ plays among ordinary numbers.
</div>

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">Zero Matrix</span></span>
The matrix with every entry equal to $0$, denoted $\mathbf{0}$. It satisfies $M + \mathbf{0} = M$ and $M\mathbf{0} = \mathbf{0}$.
</div>

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">Square Matrix</span></span>
A matrix is square if it has the same number of rows as columns ($m = n$). Many of the operations later in this course (e.g., inverses, determinants) are only defined for square matrices.
</div>

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">Diagonal Matrix</span></span>
An $n \times n$ matrix whose only nonzero entries lie on the main diagonal (top-left to bottom-right):
$$
D = \begin{bmatrix}
d_1 & 0 & \cdots & 0 \\
0 & d_2 & \cdots & 0 \\
\vdots & \vdots & \ddots & \vdots \\
0 & 0 & \cdots & d_n
\end{bmatrix}
$$
Equivalently, $D_{ij} = 0$ whenever $i \neq j$. Multiplying a vector by a diagonal matrix simply rescales each entry independently.
</div>

<div class="callout definition">
<span class="label"><span class="callout-type">Definition</span> <span class="callout-title">Symmetric Matrix</span></span>
A square matrix $S$ satisfying $S^\top = S$. Its entries are mirrored across the main diagonal, $S_{ij} = S_{ji}$ for every $i,j$.
</div>

<div class="callout example">
<span class="label"><span class="callout-type">Example</span></span>
For any matrix $M$ (square or not), $M^\top M$ is always symmetric:
$$
(M^\top M)^\top = M^\top (M^{\top})^{\top} = M^\top M
$$
This will matter directly once we start combining transposes with matrix multiplication later in the course.
</div>
