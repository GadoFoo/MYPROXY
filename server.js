const express = require('express');
const fetch = require('node-fetch'); // v2
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || null;
const GOOGLE_CX = process.env.GOOGLE_CX || null;

app.get('/api/search', async (req, res) => {
  const q = req.query.q;
  if(!q) return res.status(400).json({error:'Missing query'});
  try{
    if(GOOGLE_API_KEY && GOOGLE_CX){
      const url = `https://www.googleapis.com/customsearch/v1?key=${encodeURIComponent(GOOGLE_API_KEY)}&cx=${encodeURIComponent(GOOGLE_CX)}&q=${encodeURIComponent(q)}`;
      const r = await fetch(url);
      const d = await r.json();
      const items = (d.items||[]).map(item=>({
        title: item.title,
        snippet: item.snippet,
        link: item.link,
        displayLink: item.displayLink || (item.link? (new URL(item.link)).hostname : '')
      }));
      return res.json({engine:'google', items});
    } else {
      const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_redirect=1&skip_disambig=1`;
      const r = await fetch(url);
      const d = await r.json();
      const items = [];
      if(Array.isArray(d.RelatedTopics)){
        d.RelatedTopics.forEach(t=>{
          if(t.Text && t.FirstURL) items.push({title:t.Text, snippet:t.Text, link:t.FirstURL, displayLink:(new URL(t.FirstURL)).hostname});
          else if(t.Topics && Array.isArray(t.Topics)) t.Topics.forEach(s=>{
            if(s.Text && s.FirstURL) items.push({title:s.Text, snippet:s.Text, link:s.FirstURL, displayLink:(new URL(s.FirstURL)).hostname});
          });
        });
      }
      return res.json({engine:'duckduckgo', items});
    }
  }catch(err){
    console.error(err);
    res.status(500).json({error:'Search failed'});
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log('Search API listening on', PORT));
