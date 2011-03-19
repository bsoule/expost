## Our TODO List before we release this plugin more widely

0. add plugin settings to set source and possibly blog slug as well (e.g. in our case: padm.us, and beemblog-), or just ask user for both, or full url, or whatever.
1. Do want to expost-ify pages as well?
3. no conflicts for Markdown.php library -- do we want to do our own markdown as well?
4. How's this work if you have a different permalink structure from what we use?
5. Add README, install.txt, and how-to/FAQ thingy
X. Allow old posts to stay in the wordpress editor. (This should be fine now.)

## Magic that Expost Performs

* [Markdown with Extras](http://michelf.com/projects/php-markdown/extra/ ).
* [SmartyPants](http://michelf.com/projects/php-smartypants/ ) replacement of ascii quotes with curly quotes and whatnot.
* URLs that start with "http://" get replaced with hyperlinks.
* LaTeX-style numbering without numbers, like label/ref. $FN[details]

---

## Nitty-Gritty Details of the LaTeX-Style Numbering
 
ExPost replaces each occurrence of &dollar;REF[foo] with a unique number, starting with 1 for the first $REF occurrence and counting up sequentially with each new tag.
The tags are case sensitive.
<!-- Notice in the source here we have to use &dollar; instead of an actual dollar sign, for the obvious meta reasons. -->
 
As a shortcut, if a tag foo has been defined anywhere in the source with &dollar;REF[foo] then all other instances can be abbreviated to just $foo.
If $foo occurs where foo is *not* a tag defined anywhere with $REF then it will not be translated, *nor will any* subsequent $-prefixed tags on the same line, defined with $REF or not.
 
### Special $FN Syntax for Footnotes
 
&dollar;FN[foo] works the same as &dollar;REF[foo] except instead of getting replaced with just a number, N, it gets replaced with one of the following:
 
    <a id="foo1" href="#foo">[N]</a>
    <a id="foo" href="#foo1">[N]</a>
 
The first occurrence is replaced with the first version and the second with the second, assuming only two occurrences, per usual for footnotes.
In other words, both occurences of the tag get replaced with a number in brackets and they hyperlink to each other -- one being in the body and the other being at the bottom where the actual footnote content is. $FN[more]
 
---
 
## Footnotes
 
<font size="-1">
 
$more What happens in the case of more than two occurrences of a footnote?
One answer is, just don't do that.
But for completeness' sake, the real answer is: the natural generalization where all but the last occurrence links to the last occurrence and the last occurrence links to the first.
Specifically, each occurrence gets replaced with one of the following:
 
    <a id="fooX" href="#foo">[N]</a>
    <a id="foo" href="#foo1">[N]</a>
 
where X is defined such that &dollar;FN[foo] is the Xth occurrence of &dollar;FN[foo].
All but the last occurrence of &dollar;FN[foo] get replaced with the first version and the last occurrence (taken to be the place where the actual footnote content is given) is replaced with the second version.
Note that $FN tags and $REF tags get numbered independently but you shouldn't use the same tag foo for both a $FN and a $REF. Various screwiness will happen if you do.
Using "FOO" for one and "foo" for the other is fine though, since tags are case sensitive.
</font>
