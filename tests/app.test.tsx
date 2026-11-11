import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { App } from '../src/App';

afterEach(cleanup);
const click = (name: string | RegExp) => fireEvent.click(screen.getByRole('button', { name }));

describe('full journey (jsdom, click only)', () => {
  it('walks scenes 1 to 7 and replays', () => {
    render(<App />);
    expect(document.querySelector('.progress')?.textContent).toMatch(/1 of 6/);
    expect(screen.queryByRole('button', { name: 'Open my envelope' })).toBeNull();
    click("Yes, that's me");
    expect(screen.getByText(/The reason for this entire app/)).toBeTruthy();
    // The runaway No: with no pointer (keyboard or reduced motion) it cycles its lines, then gives up.
    click('No');
    expect(screen.getByText('Renewal is not optional.')).toBeTruthy();
    click('No');
    click('No');
    click('Fine, renew it');
    click("I'm ready");
    click('Open my envelope');
    click('Let me see');

    click('A little adventure');
    expect(screen.getByText(/You pick the direction/)).toBeTruthy();
    click('Continue');
    click('A hug');
    click('Continue');
    click('Obviously me');
    click('On to the evidence');

    // The button stays locked until every memory has been flipped (photo only, no text)
    const locked = screen.getByRole('button', { name: /Flip all 3 memories \(0 of 3\)/ });
    expect((locked as HTMLButtonElement).disabled).toBe(true);
    for (let i = 0; i < 3; i++) {
      const mem = screen.getAllByRole('button', { pressed: false }).find((b) => b.className.includes('mem') && !b.className.includes('mem-'))!;
      fireEvent.click(mem);
      expect(mem.getAttribute('aria-pressed')).toBe('true');
      expect(screen.queryByText(/caption/i)).toBeNull();
      if (i < 2) fireEvent.click(screen.getByRole('button', { name: 'Next memory' }));
    }
    expect(screen.getAllByRole('img').some((i) => /selfie/i.test(i.getAttribute('alt') ?? ''))).toBe(true);
    click('A birthday wish next');

    expect(screen.queryByRole('slider')).toBeNull();
    click('I made my wish');
    fireEvent.change(screen.getByRole('slider', { name: 'Blow out the candles' }), { target: { value: '100' } });
    expect(screen.getByText('I hope it comes true.')).toBeTruthy();
    click("There's a little more");

    click('Open your surprise');
    expect(screen.getByText(/Happy Birthday, my love/)).toBeTruthy();
    click("There's one little keepsake left");

    expect(document.querySelector('.progress')?.textContent).toMatch(/6 of 6/);
    expect(screen.getByRole('button', { name: 'Save my birthday card' })).toBeTruthy();
    expect(screen.getByText('Yes, I made a whole app for you.')).toBeTruthy();
    expect(screen.queryByRole('button', { name: /compliments/i })).toBeNull();
    click('Back');
    expect(document.querySelector('.progress')?.textContent).toMatch(/5 of 6/);
    click("There's one little keepsake left");
    click('Replay my surprise');
    expect(document.querySelector('.progress')?.textContent).toMatch(/1 of 6/);
  });
});

describe('runaway No never blocks', () => {
  it('a No on every question still reaches the envelope', () => {
    render(<App />);
    const lastTaunts = [['No', 'No', 'No', 'Okay, fine. Yes.'], ['No', 'No', 'No', 'Fine, renew it'], ['Not ready', 'Not ready', 'Not ready', "Okay, I'm ready"]];
    for (const seq of lastTaunts) seq.forEach((n) => click(n));
    expect(screen.getByRole('button', { name: 'Open my envelope' })).toBeTruthy();
  });
});

describe('source hygiene', () => {
  it('no literal U+2014 anywhere in src, index.html or tests', () => {
    const bad = String.fromCharCode(0x2014);
    const files: string[] = [];
    const walk = (d: string) =>
      readdirSync(d).forEach((f) => {
        const p = join(d, f);
        statSync(p).isDirectory() ? walk(p) : files.push(p);
      });
    ['src', 'tests'].forEach(walk);
    files.push('index.html', 'README.md');
    const offenders = files.filter((f) => {
      try {
        return readFileSync(f, 'utf8').includes(bad);
      } catch {
        return false;
      }
    });
    expect(offenders).toEqual([]);
  });
});
