'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const cssString = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #0A0A0F;
    --card:     #13131A;
    --purple:   #6C63FF;
    --coral:    #FF6B6B;
    --white:    #FFFFFF;
    --muted:    rgba(255,255,255,0.55);
    --border:   rgba(255,255,255,0.07);
    --radius:   16px;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--white);
    font-family: 'Inter', sans-serif;
    overflow-x: hidden;
    line-height: 1.6;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--purple); border-radius: 99px; }

  #starfield {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }

  nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 64px;
    background: rgba(10,10,15,0.6);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    transition: padding 0.3s;
  }

  .nav-logo {
    font-size: 1.75rem;
    font-weight: 800;
    letter-spacing: -1px;
    background: linear-gradient(135deg, var(--purple), var(--coral));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .nav-links {
    display: flex;
    gap: 36px;
    list-style: none;
  }

  .nav-links a {
    text-decoration: none;
    color: var(--muted);
    font-size: 0.9rem;
    font-weight: 500;
    transition: color 0.2s;
  }

  .nav-links a:hover { color: var(--white); }

  .nav-cta {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .btn-ghost {
    padding: 10px 22px;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: transparent;
    color: var(--white);
    font-family: 'Inter', sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    text-decoration: none;
    display: inline-block;
  }
  .btn-ghost:hover {
    border-color: var(--purple);
    background: rgba(108,99,255,0.1);
  }

  .btn-primary {
    padding: 10px 22px;
    border: none;
    border-radius: var(--radius);
    background: linear-gradient(135deg, var(--purple), #8B84FF);
    color: var(--white);
    font-family: 'Inter', sans-serif;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 0 20px rgba(108,99,255,0.35);
    text-decoration: none;
    display: inline-block;
  }
  .btn-primary:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 0 30px rgba(108,99,255,0.55);
  }

  .hero {
    position: relative;
    z-index: 1;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 140px 24px 80px;
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 7px 18px;
    border: 1px solid rgba(108,99,255,0.4);
    border-radius: 99px;
    background: rgba(108,99,255,0.1);
    font-size: 0.78rem;
    font-weight: 500;
    color: #a89eff;
    margin-bottom: 28px;
    animation: fadeUp 0.7s ease both;
  }

  .hero-badge .dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: var(--purple);
    box-shadow: 0 0 8px var(--purple);
    animation: pulse 2s infinite;
  }

  .hero-title {
    font-size: clamp(3rem, 7vw, 6rem);
    font-weight: 900;
    letter-spacing: -3px;
    line-height: 1.0;
    max-width: 900px;
    animation: fadeUp 0.7s ease 0.1s both;
  }

  .hero-title span.purple {
    background: linear-gradient(135deg, var(--purple), #a89eff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-title span.coral {
    background: linear-gradient(135deg, var(--coral), #ffaa5e);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-sub {
    margin-top: 24px;
    font-size: 1.15rem;
    color: var(--muted);
    max-width: 560px;
    font-weight: 400;
    animation: fadeUp 0.7s ease 0.2s both;
  }

  .hero-actions {
    margin-top: 40px;
    display: flex;
    gap: 16px;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
    animation: fadeUp 0.7s ease 0.3s both;
  }

  .btn-large {
    padding: 16px 36px;
    font-size: 1rem;
    border-radius: var(--radius);
  }

  .btn-outline-large {
    padding: 15px 36px;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: transparent;
    color: var(--white);
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
  }
  .btn-outline-large:hover {
    border-color: var(--coral);
    background: rgba(255,107,107,0.08);
    color: var(--coral);
  }

  .hero-stats {
    margin-top: 72px;
    display: flex;
    gap: 64px;
    flex-wrap: wrap;
    justify-content: center;
    animation: fadeUp 0.7s ease 0.4s both;
  }

  .stat { text-align: center; }

  .stat-num {
    font-size: 2.2rem;
    font-weight: 800;
    letter-spacing: -1px;
    background: linear-gradient(135deg, var(--white), var(--muted));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .stat-label {
    font-size: 0.8rem;
    color: var(--muted);
    font-weight: 500;
    margin-top: 4px;
  }

  .hero-search {
    margin-top: 48px;
    width: 100%;
    max-width: 680px;
    animation: fadeUp 0.7s ease 0.35s both;
  }

  .search-box {
    display: flex;
    align-items: center;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 8px 8px 8px 20px;
    gap: 12px;
    box-shadow: 0 0 40px rgba(108,99,255,0.12);
    transition: box-shadow 0.3s, border-color 0.3s;
  }
  .search-box:focus-within {
    border-color: rgba(108,99,255,0.5);
    box-shadow: 0 0 40px rgba(108,99,255,0.25);
  }

  .search-box input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: var(--white);
    font-family: 'Inter', sans-serif;
    font-size: 0.95rem;
  }
  .search-box input::placeholder { color: var(--muted); }

  .search-box .search-icon {
    color: var(--muted);
    font-size: 1.1rem;
  }

  .search-btn {
    padding: 12px 24px;
    border: none;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--purple), #8B84FF);
    color: var(--white);
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    box-shadow: 0 0 16px rgba(108,99,255,0.4);
    transition: box-shadow 0.2s, transform 0.2s;
    text-decoration: none;
  }
  .search-btn:hover {
    box-shadow: 0 0 28px rgba(108,99,255,0.6);
    transform: translateY(-1px);
  }

  section { position: relative; z-index: 1; padding: 96px 64px; }

  .section-label {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--purple);
    margin-bottom: 14px;
  }

  .section-title {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800;
    letter-spacing: -1.5px;
    line-height: 1.1;
    margin-bottom: 16px;
  }

  .section-sub {
    font-size: 1rem;
    color: var(--muted);
    max-width: 520px;
    line-height: 1.7;
  }

  .section-header { margin-bottom: 60px; }
  .section-header.center { text-align: center; }
  .section-header.center .section-sub { margin: 0 auto; }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
  }

  .feature-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 36px 32px;
    transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
    position: relative;
    overflow: hidden;
  }

  .feature-card::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 160px; height: 160px;
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.4s;
  }

  .feature-card:hover {
    transform: translateY(-6px);
    border-color: rgba(108,99,255,0.35);
    box-shadow: 0 8px 48px rgba(108,99,255,0.18), 0 0 0 1px rgba(108,99,255,0.12);
  }

  .feature-card:hover::before { opacity: 0.12; }

  .feature-card.coral:hover {
    border-color: rgba(255,107,107,0.35);
    box-shadow: 0 8px 48px rgba(255,107,107,0.18), 0 0 0 1px rgba(255,107,107,0.12);
  }
  .feature-card.coral::before { background: var(--coral); }

  .feature-card.purple::before { background: var(--purple); }

  .feature-icon {
    width: 52px; height: 52px;
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem;
    margin-bottom: 24px;
  }

  .feature-icon.purple { background: rgba(108,99,255,0.15); }
  .feature-icon.coral  { background: rgba(255,107,107,0.15); }
  .feature-icon.green  { background: rgba(78,205,196,0.15); }
  .feature-icon.gold   { background: rgba(255,190,85,0.15); }

  .feature-title {
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 10px;
  }

  .feature-desc {
    font-size: 0.9rem;
    color: var(--muted);
    line-height: 1.7;
  }

  .how-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
  }

  .steps { display: flex; flex-direction: column; gap: 32px; }

  .step {
    display: flex;
    gap: 20px;
    align-items: flex-start;
    cursor: pointer;
  }

  .step-num {
    min-width: 48px; height: 48px;
    border-radius: 14px;
    background: var(--card);
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--muted);
    transition: background 0.3s, border-color 0.3s, color 0.3s, box-shadow 0.3s;
  }

  .step.active .step-num {
    background: var(--purple);
    border-color: var(--purple);
    color: var(--white);
    box-shadow: 0 0 20px rgba(108,99,255,0.45);
  }

  .step-content h4 {
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 6px;
  }

  .step-content p {
    font-size: 0.875rem;
    color: var(--muted);
    line-height: 1.6;
  }

  .how-visual {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .phone-mockup {
    width: 300px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 36px;
    padding: 24px 20px;
    box-shadow: 0 0 60px rgba(108,99,255,0.2), 0 0 120px rgba(108,99,255,0.08);
    position: relative;
    overflow: hidden;
  }

  .phone-mockup::before {
    content: '';
    position: absolute;
    top: -40px; left: 50%;
    transform: translateX(-50%);
    width: 120px; height: 30px;
    background: rgba(255,255,255,0.05);
    border-radius: 0 0 20px 20px;
  }

  .phone-screen-item {
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 14px 16px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .phone-screen-item:last-child { margin-bottom: 0; }

  .psi-icon {
    width: 40px; height: 40px;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--purple), var(--coral));
    flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem;
  }

  .psi-content { flex: 1; }

  .psi-title {
    font-size: 0.8rem;
    font-weight: 600;
    margin-bottom: 3px;
  }

  .psi-sub {
    font-size: 0.7rem;
    color: var(--muted);
  }

  .psi-tag {
    font-size: 0.65rem;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 99px;
  }
  .psi-tag.purple { background: rgba(108,99,255,0.2); color: #a89eff; }
  .psi-tag.coral  { background: rgba(255,107,107,0.2); color: #ffaa99; }
  .psi-tag.green  { background: rgba(78,205,196,0.2);  color: #7ee8e3; }

  .destinations-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto auto;
    gap: 20px;
  }

  .dest-card {
    border-radius: var(--radius);
    overflow: hidden;
    position: relative;
    cursor: pointer;
    background: var(--card);
    border: 1px solid var(--border);
    height: 240px;
    transition: transform 0.3s, box-shadow 0.3s;
  }

  .dest-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.4);
  }

  .dest-card.large {
    grid-column: span 2;
    height: 300px;
  }

  .dest-bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    transition: transform 0.5s;
  }

  .dest-card:hover .dest-bg { transform: scale(1.05); }

  .dest-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(10,10,15,0.85) 0%, rgba(10,10,15,0.1) 60%);
  }

  .dest-info {
    position: absolute;
    bottom: 20px; left: 20px; right: 20px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  .dest-name {
    font-size: 1.15rem;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .dest-country {
    font-size: 0.78rem;
    color: var(--muted);
  }

  .dest-price {
    font-size: 0.8rem;
    font-weight: 700;
    padding: 6px 14px;
    border-radius: 99px;
    background: rgba(108,99,255,0.25);
    border: 1px solid rgba(108,99,255,0.4);
    color: #c0baff;
    white-space: nowrap;
  }

  .dest-1 .dest-bg { background: linear-gradient(135deg, #1a1040 0%, #3d1a6e 50%, #6c1fa3 100%); }
  .dest-2 .dest-bg { background: linear-gradient(135deg, #0d2137 0%, #1a4a6e 50%, #1a7aaa 100%); }
  .dest-3 .dest-bg { background: linear-gradient(135deg, #2a0d0d 0%, #6e1a1a 50%, #aa3030 100%); }
  .dest-4 .dest-bg { background: linear-gradient(135deg, #0d2a14 0%, #1a6e30 50%, #30aa50 100%); }
  .dest-5 .dest-bg { background: linear-gradient(135deg, #2a1a0d 0%, #6e4a1a 50%, #aa7030 100%); }

  .dest-bg::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 80px;
    background: inherit;
    filter: brightness(0.4);
  }

  .testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
  }

  .testi-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 32px 28px;
    transition: transform 0.3s, box-shadow 0.3s;
  }

  .testi-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 40px rgba(108,99,255,0.12);
  }

  .testi-stars {
    display: flex;
    gap: 4px;
    margin-bottom: 16px;
  }

  .testi-stars span { color: #FFD700; font-size: 0.85rem; }

  .testi-text {
    font-size: 0.9rem;
    color: rgba(255,255,255,0.8);
    line-height: 1.7;
    margin-bottom: 24px;
    font-style: italic;
  }

  .testi-author {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .testi-avatar {
    width: 40px; height: 40px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem;
    font-weight: 700;
    background: linear-gradient(135deg, var(--purple), var(--coral));
  }

  .testi-name {
    font-size: 0.875rem;
    font-weight: 600;
  }

  .testi-handle {
    font-size: 0.75rem;
    color: var(--muted);
  }

  .pricing-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
    max-width: 960px;
    margin: 0 auto;
  }

  .price-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 36px 32px;
    position: relative;
    transition: transform 0.3s, box-shadow 0.3s;
  }

  .price-card:hover { transform: translateY(-4px); }

  .price-card.featured {
    border-color: rgba(108,99,255,0.5);
    box-shadow: 0 0 60px rgba(108,99,255,0.18);
  }

  .price-popular {
    position: absolute;
    top: -13px; left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, var(--purple), #8B84FF);
    color: var(--white);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 5px 16px;
    border-radius: 99px;
    white-space: nowrap;
  }

  .price-tier {
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: var(--muted);
    margin-bottom: 16px;
  }

  .price-amount {
    font-size: 3rem;
    font-weight: 900;
    letter-spacing: -2px;
    line-height: 1;
    margin-bottom: 6px;
  }

  .price-amount span {
    font-size: 1.2rem;
    font-weight: 500;
    letter-spacing: 0;
    color: var(--muted);
  }

  .price-period {
    font-size: 0.8rem;
    color: var(--muted);
    margin-bottom: 28px;
  }

  .price-features {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 32px;
  }

  .price-features li {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.875rem;
    color: rgba(255,255,255,0.8);
  }

  .price-features li .check {
    width: 20px; height: 20px;
    border-radius: 50%;
    background: rgba(108,99,255,0.15);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.65rem;
    color: #a89eff;
    flex-shrink: 0;
  }

  .price-features li .check.coral {
    background: rgba(255,107,107,0.15);
    color: #ffaa99;
  }

  .cta-banner {
    margin: 0 64px 80px;
    background: linear-gradient(135deg, rgba(108,99,255,0.15), rgba(255,107,107,0.08));
    border: 1px solid rgba(108,99,255,0.25);
    border-radius: 24px;
    padding: 72px 80px;
    text-align: center;
    position: relative;
    z-index: 1;
    overflow: hidden;
  }

  .cta-banner::before {
    content: '';
    position: absolute;
    top: -80px; left: 50%;
    transform: translateX(-50%);
    width: 400px; height: 200px;
    background: radial-gradient(ellipse, rgba(108,99,255,0.25), transparent 70%);
    pointer-events: none;
  }

  .cta-banner h2 {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 900;
    letter-spacing: -1.5px;
    margin-bottom: 16px;
  }

  .cta-banner p {
    font-size: 1rem;
    color: var(--muted);
    max-width: 480px;
    margin: 0 auto 36px;
  }

  .cta-actions {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
  }

  footer {
    position: relative;
    z-index: 1;
    border-top: 1px solid var(--border);
    padding: 60px 64px 36px;
  }

  .footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 48px;
    margin-bottom: 48px;
  }

  .footer-brand .nav-logo {
    display: inline-block;
    margin-bottom: 14px;
    font-size: 1.5rem;
  }

  .footer-brand p {
    font-size: 0.85rem;
    color: var(--muted);
    line-height: 1.7;
    max-width: 280px;
  }

  .footer-col h5 {
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: var(--muted);
    margin-bottom: 16px;
  }

  .footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }

  .footer-col ul a {
    text-decoration: none;
    color: rgba(255,255,255,0.6);
    font-size: 0.875rem;
    transition: color 0.2s;
  }
  .footer-col ul a:hover { color: var(--white); }

  .footer-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 24px;
    border-top: 1px solid var(--border);
    font-size: 0.8rem;
    color: var(--muted);
  }

  .social-links {
    display: flex;
    gap: 12px;
  }

  .social-link {
    width: 36px; height: 36px;
    border-radius: 10px;
    background: var(--card);
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.85rem;
    text-decoration: none;
    color: var(--muted);
    transition: border-color 0.2s, color 0.2s, box-shadow 0.2s;
  }
  .social-link:hover {
    border-color: var(--purple);
    color: var(--white);
    box-shadow: 0 0 12px rgba(108,99,255,0.3);
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.6; transform: scale(0.85); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-12px); }
  }

  .phone-mockup { animation: float 5s ease-in-out infinite; }

  .reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 1024px) {
    nav { padding: 18px 32px; }
    section { padding: 72px 32px; }
    .how-wrapper { grid-template-columns: 1fr; }
    .how-visual { display: none; }
    .footer-grid { grid-template-columns: 1fr 1fr; }
    .cta-banner { margin: 0 32px 60px; padding: 48px 32px; }
  }

  @media (max-width: 768px) {
    nav { padding: 16px 20px; }
    .nav-links { display: none; }
    section { padding: 60px 20px; }
    .destinations-grid { grid-template-columns: 1fr 1fr; }
    .dest-card.large { grid-column: span 2; }
    .footer-grid { grid-template-columns: 1fr; gap: 32px; }
    footer { padding: 48px 20px 28px; }
    .cta-banner { margin: 0 20px 48px; padding: 40px 24px; }
  }

  @media (max-width: 500px) {
    .destinations-grid { grid-template-columns: 1fr; }
    .dest-card.large { grid-column: span 1; }
    .hero-stats { gap: 36px; }
  }
`;

export default function LandingPage() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const canvas = document.getElementById('starfield') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let W: number, H: number;
    let stars: { x: number, y: number, r: number, color: string, speed: number, alpha: number, phase: number }[] = [];
    const shooting: { x: number, y: number, len: number, angle: number, speed: number, alpha: number, done: boolean }[] = [];
    let animationFrameId: number;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function randomRange(a: number, b: number) { return a + Math.random() * (b - a); }

    function initStars() {
      stars = [];
      for (let i = 0; i < 240; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: randomRange(0.3, 1.6),
          alpha: randomRange(0.2, 0.9),
          speed: randomRange(0.0003, 0.001),
          phase: Math.random() * Math.PI * 2,
          color: Math.random() < 0.15 ? '#6C63FF' : Math.random() < 0.1 ? '#FF6B6B' : '#FFFFFF'
        });
      }
    }

    function addShooting() {
      if (Math.random() < 0.012 && shooting.length < 3) {
        const startX = randomRange(W * 0.1, W * 0.9);
        const startY = randomRange(0, H * 0.4);
        shooting.push({ x: startX, y: startY, len: randomRange(80, 180), angle: randomRange(20, 50) * Math.PI / 180, speed: randomRange(8, 14), alpha: 1, done: false });
      }
    }

    function drawStars(t: number) {
      ctx!.clearRect(0, 0, W, H);

      stars.forEach(s => {
        const a = s.alpha * (0.6 + 0.4 * Math.sin(t * s.speed * 1000 + s.phase));
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx!.fillStyle = s.color === '#FFFFFF'
          ? `rgba(255,255,255,${a})`
          : s.color === '#6C63FF'
            ? `rgba(108,99,255,${a})`
            : `rgba(255,107,107,${a})`;
        ctx!.fill();
      });

      shooting.forEach((sh, i) => {
        if (sh.done) return;
        const ex = sh.x + Math.cos(sh.angle) * sh.len;
        const ey = sh.y + Math.sin(sh.angle) * sh.len;
        const grad = ctx!.createLinearGradient(sh.x, sh.y, ex, ey);
        grad.addColorStop(0, `rgba(255,255,255,0)`);
        grad.addColorStop(1, `rgba(255,255,255,${sh.alpha * 0.9})`);
        ctx!.beginPath();
        ctx!.moveTo(sh.x, sh.y);
        ctx!.lineTo(ex, ey);
        ctx!.strokeStyle = grad;
        ctx!.lineWidth = 1.2;
        ctx!.stroke();

        sh.x += Math.cos(sh.angle) * sh.speed;
        sh.y += Math.sin(sh.angle) * sh.speed;
        sh.alpha -= 0.025;
        if (sh.alpha <= 0) shooting.splice(i, 1);
      });
    }

    let last = 0;
    function loop(t: number) {
      last = t;
      addShooting();
      drawStars(t / 1000);
      animationFrameId = requestAnimationFrame(loop);
    }

    resize();
    initStars();
    window.addEventListener('resize', resizeInitStars);
    
    function resizeInitStars() {
      resize();
      initStars();
    }
    
    animationFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resizeInitStars);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    const items = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    items.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const nav = document.querySelector('nav');
    const handleScroll = () => {
      if (nav) {
        nav.style.padding = window.scrollY > 40 ? '14px 64px' : '20px 64px';
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssString }} />
      <canvas id="starfield"></canvas>

      <nav>
        <div className="nav-logo">wandr</div>
        <ul className="nav-links">
          <li><Link href="/login">The Modes</Link></li>
          <li><Link href="/login">How it works</Link></li>
          <li><Link href="/login">Destinations</Link></li>
          <li><Link href="/login">Start wandring</Link></li>
        </ul>
        <div className="nav-cta">
          <Link href="/login" className="btn-ghost">Sign in</Link>
          <Link href="/login" className="btn-primary">Get started</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-badge">
          <span className="dot"></span>
          AI-powered travel planner — now in beta
        </div>

        <h1 className="hero-title">
          You don&apos;t know where<br />to go. <span className="coral">Wandr</span> does.
        </h1>

        <p className="hero-sub">
          Tell us everything. Tell us nothing.<br />
          Pick a vibe, start a conversation, or just feel lucky — Wandr builds your perfect trip either way.
        </p>

        <div className="hero-search">
          <div className="search-box">
            <span className="search-icon">✦</span>
            <input type="text" placeholder='Try "I have no idea" or "cozy mountain vibes" or just hit Enter…' />
            <Link href="/login" className="search-btn">Plan Trip →</Link>
          </div>
        </div>

        <div className="hero-actions">
          <Link href="/login" className="btn-primary btn-large">Find Your Wander Style</Link>
        </div>

        <div className="hero-stats">
          <div className="stat">
            <div className="stat-num">40%</div>
            <div className="stat-label">of "Total Lost" travelers<br/>found their best trip ever</div>
          </div>
          <div className="stat">
            <div className="stat-num">94%</div>
            <div className="stat-label">Vibe match accuracy</div>
          </div>
          <div className="stat">
            <div className="stat-num">0</div>
            <div className="stat-label">Regrets (mostly)</div>
          </div>
        </div>
      </section>

      <section id="features">
        <div className="section-header center reveal">
          <div className="section-label">The Modes</div>
          <h2 className="section-title">Three ways to wander</h2>
          <p className="section-sub">No itinerary? No problem. No destination? Even better. Choose your starting point — Wandr handles the rest.</p>
        </div>

        <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <div className="feature-card purple reveal">
            <div className="feature-icon purple">🌀</div>
            <div className="feature-title">Total Lost</div>
            <p className="feature-desc">No plan. No destination. No idea. Just tell Wandr you&apos;re lost and it builds something you never would have booked yourself — but absolutely should. 40% of users call it the best trip they&apos;ve ever taken.</p>
          </div>
          <div className="feature-card coral reveal" style={{ transitionDelay: '0.1s' }}>
            <div className="feature-icon coral">✨</div>
            <div className="feature-title">Vibe Check</div>
            <p className="feature-desc">You know the feeling, even if you don&apos;t know the place. Cozy mountain town. Chaotic night market. Sun-drenched cliffs at golden hour. Describe your vibe — a word, a mood, a playlist — and Wandr finds the destination that matches it perfectly. 94% accuracy, apparently.</p>
          </div>
          <div className="feature-card reveal" style={{ transitionDelay: '0.2s' }}>
            <div className="feature-icon green">🎲</div>
            <div className="feature-title">Feeling Lucky</div>
            <p className="feature-desc">Hit the button. Get a trip. No questions asked. A full itinerary — flights, hotels, things to do — lands in your lap in under 10 seconds. Somewhere in the world is waiting for you. We dare you to find out where.</p>
          </div>
        </div>
      </section>

      <section id="how" style={{ background: 'rgba(108,99,255,0.03)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="how-wrapper">
          <div>
            <div className="section-header reveal">
              <div className="section-label">How it works</div>
              <h2 className="section-title">From &quot;I don&apos;t know&quot;<br/>to boarding pass</h2>
              <p className="section-sub">Four steps. However much — or little — you know.</p>
            </div>

            <div className="steps">
              <div className={`step ${activeStep === 0 ? 'active' : ''} reveal`} onClick={() => setActiveStep(0)}>
                <div className="step-num">01</div>
                <div className="step-content">
                  <h4>Pick your mode</h4>
                  <p>Total Lost, Vibe Check, or Feeling Lucky. There&apos;s no wrong answer — only the trip you&apos;re about to take.</p>
                </div>
              </div>
              <div className={`step ${activeStep === 1 ? 'active' : ''} reveal`} style={{ transitionDelay: '0.1s' }} onClick={() => setActiveStep(1)}>
                <div className="step-num">02</div>
                <div className="step-content">
                  <h4>Wandr reads between the lines</h4>
                  <p>Whether you typed a novel or a single emoji, our AI figures out what you actually want — sometimes before you do.</p>
                </div>
              </div>
              <div className={`step ${activeStep === 2 ? 'active' : ''} reveal`} style={{ transitionDelay: '0.2s' }} onClick={() => setActiveStep(2)}>
                <div className="step-num">03</div>
                <div className="step-content">
                  <h4>Your full itinerary appears</h4>
                  <p>Flights, stays, things to do, places to eat. A complete trip — built in seconds, ready to go as-is or tweak to your heart&apos;s content.</p>
                </div>
              </div>
              <div className={`step ${activeStep === 3 ? 'active' : ''} reveal`} style={{ transitionDelay: '0.3s' }} onClick={() => setActiveStep(3)}>
                <div className="step-num">04</div>
                <div className="step-content">
                  <h4>Confirm & go</h4>
                  <p>Adjust a hotel, swap a detour, or just hit confirm. Either way, you&apos;re going somewhere great. We&apos;ll handle the rest.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="how-visual reveal">
            <div className="phone-mockup">
              <div style={{ textAlign: 'center', padding: '8px 0 20px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '2px', color: 'var(--muted)' }}>WANDR</div>
              <div className="phone-screen-item">
                <div className="psi-icon">✈️</div>
                <div className="psi-content">
                  <div className="psi-title">Tokyo → Kyoto</div>
                  <div className="psi-sub">Day 3 · 08:30 Shinkansen</div>
                </div>
                <span className="psi-tag purple">On track</span>
              </div>
              <div className="phone-screen-item">
                <div className="psi-icon">🏯</div>
                <div className="psi-content">
                  <div className="psi-title">Fushimi Inari</div>
                  <div className="psi-sub">Day 3 · 14:00 – 17:00</div>
                </div>
                <span className="psi-tag green">Booked</span>
              </div>
              <div className="phone-screen-item">
                <div className="psi-icon">🍜</div>
                <div className="psi-content">
                  <div className="psi-title">Dinner · Nishiki Mkt</div>
                  <div className="psi-sub">Day 3 · 19:00 · ¥3,800</div>
                </div>
                <span className="psi-tag coral">New deal</span>
              </div>
              <div className="phone-screen-item">
                <div className="psi-icon">🏨</div>
                <div className="psi-content">
                  <div className="psi-title">Hotel Granvia Kyoto</div>
                  <div className="psi-sub">Check-in 15:00 · 2 nights</div>
                </div>
                <span className="psi-tag purple">Confirmed</span>
              </div>
              <div style={{ marginTop: '16px', padding: '14px 16px', background: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(255,107,107,0.15))', borderRadius: '12px', border: '1px solid rgba(108,99,255,0.25)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '6px' }}>BUDGET TRACKER</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>$1,240 <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--muted)' }}>of $2,000</span></div>
                <div style={{ marginTop: '8px', height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ width: '62%', height: '100%', background: 'linear-gradient(90deg, var(--purple), var(--coral))', borderRadius: '99px' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="destinations">
        <div className="section-header center reveal">
          <div className="section-label">Destinations</div>
          <h2 className="section-title">Trending right now</h2>
          <p className="section-sub">Real-time popularity data so you discover what travellers love this season.</p>
        </div>

        <div className="destinations-grid">
          <div className="dest-card dest-1 large reveal">
            <div className="dest-bg">
              <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '60%', opacity: 0.4 }} viewBox="0 0 800 200" preserveAspectRatio="none">
                <rect x="50" y="80" width="40" height="120" fill="#fff" opacity={0.15}/>
                <rect x="100" y="50" width="30" height="150" fill="#fff" opacity={0.12}/>
                <rect x="140" y="100" width="50" height="100" fill="#fff" opacity={0.1}/>
                <rect x="200" y="40" width="25" height="160" fill="#fff" opacity={0.2}/>
                <rect x="240" y="70" width="60" height="130" fill="#fff" opacity={0.1}/>
                <rect x="310" y="20" width="20" height="180" fill="#fff" opacity={0.18}/>
                <rect x="340" y="60" width="45" height="140" fill="#fff" opacity={0.12}/>
                <rect x="400" y="90" width="35" height="110" fill="#fff" opacity={0.1}/>
                <rect x="450" y="30" width="28" height="170" fill="#fff" opacity={0.15}/>
                <rect x="490" y="70" width="55" height="130" fill="#fff" opacity={0.1}/>
                <rect x="560" y="50" width="30" height="150" fill="#fff" opacity={0.13}/>
                <rect x="600" y="80" width="45" height="120" fill="#fff" opacity={0.1}/>
                <rect x="660" y="40" width="20" height="160" fill="#fff" opacity={0.17}/>
                <rect x="690" y="65" width="60" height="135" fill="#fff" opacity={0.1}/>
              </svg>
            </div>
            <div className="dest-overlay"></div>
            <div className="dest-info">
              <div>
                <div className="dest-name">Tokyo</div>
                <div className="dest-country">Japan</div>
              </div>
              <div className="dest-price">from $890</div>
            </div>
          </div>

          <div className="dest-card dest-2 reveal" style={{ transitionDelay: '0.1s' }}>
            <div className="dest-bg">
              <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '70%', opacity: 0.4 }} viewBox="0 0 400 200" preserveAspectRatio="none">
                <rect x="20" y="100" width="30" height="100" fill="#fff" opacity={0.15}/>
                <rect x="60" y="60" width="25" height="140" fill="#fff" opacity={0.12}/>
                <rect x="95" y="80" width="40" height="120" fill="#fff" opacity={0.1}/>
                <rect x="145" y="30" width="20" height="170" fill="#fff" opacity={0.2}/>
                <rect x="175" y="70" width="35" height="130" fill="#fff" opacity={0.1}/>
                <rect x="220" y="50" width="28" height="150" fill="#fff" opacity={0.15}/>
                <rect x="260" y="90" width="45" height="110" fill="#fff" opacity={0.1}/>
                <rect x="315" y="40" width="22" height="160" fill="#fff" opacity={0.18}/>
                <rect x="345" y="75" width="40" height="125" fill="#fff" opacity={0.1}/>
              </svg>
            </div>
            <div className="dest-overlay"></div>
            <div className="dest-info">
              <div>
                <div className="dest-name">Santorini</div>
                <div className="dest-country">Greece</div>
              </div>
              <div className="dest-price">from $720</div>
            </div>
          </div>

          <div className="dest-card dest-3 reveal" style={{ transitionDelay: '0.15s' }}>
            <div className="dest-bg"></div>
            <div className="dest-overlay"></div>
            <div className="dest-info">
              <div>
                <div className="dest-name">Marrakech</div>
                <div className="dest-country">Morocco</div>
              </div>
              <div className="dest-price">from $510</div>
            </div>
          </div>

          <div className="dest-card dest-4 reveal" style={{ transitionDelay: '0.2s' }}>
            <div className="dest-bg"></div>
            <div className="dest-overlay"></div>
            <div className="dest-info">
              <div>
                <div className="dest-name">Bali</div>
                <div className="dest-country">Indonesia</div>
              </div>
              <div className="dest-price">from $640</div>
            </div>
          </div>

          <div className="dest-card dest-5 reveal" style={{ transitionDelay: '0.25s' }}>
            <div className="dest-bg"></div>
            <div className="dest-overlay"></div>
            <div className="dest-info">
              <div>
                <div className="dest-name">Lisbon</div>
                <div className="dest-country">Portugal</div>
              </div>
              <div className="dest-price">from $480</div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="section-header center reveal">
          <div className="section-label">Real wandrers</div>
          <h2 className="section-title">They had no plan.<br/>They had a great time.</h2>
        </div>

        <div className="testimonials-grid">
          <div className="testi-card reveal">
            <div className="testi-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
            <p className="testi-text">&quot;I used Total Lost on a whim during my lunch break. Three weeks later I was eating fresh pasta in a village in Sicily I&apos;d never heard of. I didn&apos;t plan a single thing. It was the best trip of my life.&quot;</p>
            <div className="testi-author">
              <div className="testi-avatar">SR</div>
              <div>
                <div className="testi-name">Sofia Reyes</div>
                <div className="testi-handle">Total Lost mode · Mexico City</div>
              </div>
            </div>
          </div>

          <div className="testi-card reveal" style={{ transitionDelay: '0.1s' }}>
            <div className="testi-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
            <p className="testi-text">&quot;I typed &apos;misty forests, no tourists, good coffee&apos; into Vibe Check. Wandr sent me to the Azores. I didn&apos;t even know the Azores existed. I&apos;m moving there.&quot;</p>
            <div className="testi-author">
              <div className="testi-avatar">JK</div>
              <div>
                <div className="testi-name">James Kato</div>
                <div className="testi-handle">Vibe Check mode · London</div>
              </div>
            </div>
          </div>

          <div className="testi-card reveal" style={{ transitionDelay: '0.2s' }}>
            <div className="testi-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
            <p className="testi-text">&quot;Hit Feeling Lucky at 11pm on a Tuesday. By Thursday morning I was on a flight to Tbilisi with a full itinerary on my phone. Zero regrets. Actually, one — that I didn&apos;t do it sooner.&quot;</p>
            <div className="testi-author">
              <div className="testi-avatar">AM</div>
              <div>
                <div className="testi-name">Aisha Mensah</div>
                <div className="testi-handle">Feeling Lucky mode · Accra</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="modes" style={{ background: 'rgba(108,99,255,0.03)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="section-header center reveal">
          <div className="section-label">Start wandring</div>
          <h2 className="section-title">Three ways to wander.<br/><span style={{ background: 'linear-gradient(135deg,var(--purple),var(--coral))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>One destination: yours.</span></h2>
          <p className="section-sub">Pick the mode that matches your energy right now. You can always switch.</p>
        </div>

        <div className="pricing-grid">
          <div className="price-card reveal">
            <div className="feature-icon purple" style={{ marginBottom: '20px' }}>🌀</div>
            <div className="price-tier">Total Lost</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '28px' }}>No destination. No plan. No idea where to start. Perfect. Tell Wandr you&apos;re lost and let it take the wheel entirely.</p>
            <Link href="/login" className="btn-ghost" style={{ display: 'block', width: '100%', padding: '14px', textAlign: 'center' }}>I&apos;m totally lost →</Link>
          </div>

          <div className="price-card featured reveal" style={{ transitionDelay: '0.1s' }}>
            <div className="price-popular">Most popular</div>
            <div className="feature-icon coral" style={{ marginBottom: '20px' }}>✨</div>
            <div className="price-tier">Vibe Check</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '28px' }}>You know the feeling — you just don&apos;t know the place. Describe your vibe and Wandr will find exactly where you need to be.</p>
            <Link href="/login" className="btn-primary" style={{ display: 'block', width: '100%', padding: '14px', textAlign: 'center' }}>Check my vibe →</Link>
          </div>

          <div className="price-card reveal" style={{ transitionDelay: '0.2s' }}>
            <div className="feature-icon green" style={{ marginBottom: '20px' }}>🎲</div>
            <div className="price-tier">Feeling Lucky</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '28px' }}>One button. One trip. No questions. Somewhere in the world is already waiting for you — find out where in under 10 seconds.</p>
            <Link href="/login" className="btn-ghost" style={{ display: 'block', width: '100%', padding: '14px', borderColor: 'rgba(255,107,107,0.3)', textAlign: 'center' }}>I&apos;m feeling lucky →</Link>
          </div>
        </div>
      </section>

      <div className="cta-banner reveal">
        <h2>The only bad trip is<br/>the one you didn&apos;t take</h2>
        <p>Stop waiting for the perfect plan. Wandr is the plan.</p>
        <div className="cta-actions">
          <Link href="/login" className="btn-primary btn-large">Find Your Wander Style</Link>
        </div>
      </div>

      <footer>
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="nav-logo">wandr</div>
            <p>The intelligent travel planner that turns your wanderlust into perfectly crafted adventures — anywhere in the world.</p>
          </div>
          <div className="footer-col">
            <h5>Product</h5>
            <ul>
              <li><Link href="/login">Features</Link></li>
              <li><Link href="/login">Pricing</Link></li>
              <li><Link href="/login">Changelog</Link></li>
              <li><Link href="/login">Roadmap</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Company</h5>
            <ul>
              <li><Link href="/login">About</Link></li>
              <li><Link href="/login">Blog</Link></li>
              <li><Link href="/login">Careers</Link></li>
              <li><Link href="/login">Press</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Legal</h5>
            <ul>
              <li><Link href="/login">Privacy</Link></li>
              <li><Link href="/login">Terms</Link></li>
              <li><Link href="/login">Cookies</Link></li>
              <li><Link href="/login">Security</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 wandr, Inc. All rights reserved.</span>
          <div className="social-links">
            <Link className="social-link" href="/login" title="Twitter">𝕏</Link>
            <Link className="social-link" href="/login" title="Instagram">◎</Link>
            <Link className="social-link" href="/login" title="TikTok">▶</Link>
            <Link className="social-link" href="/login" title="LinkedIn">in</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
