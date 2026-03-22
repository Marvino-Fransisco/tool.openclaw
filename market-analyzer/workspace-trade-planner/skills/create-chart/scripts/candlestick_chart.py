#!/usr/bin/env python3

import json
import sys
import os
from pathlib import Path
import pandas as pd
import mplfinance as mpf
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches



def load_json_data(file_path):
    with open(file_path, 'r') as f:
        return json.load(f)


def prepare_dataframe(data):
    df = pd.DataFrame(data['candles'])
    df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
    df.set_index('timestamp', inplace=True)
    df = df[['open', 'high', 'low', 'close', 'volume']]
    return df


def load_trade_data(file_path='./idea/trade.json'):
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
            return {
                'valueAreaPairs': data.get('valueAreaPairs', []),
                'entry': data.get('entry'),
                'sl': data.get('sl'),
                'tp1': data.get('tp1'),
                'tp2': data.get('tp2'),
                'currentPrice': data.get('currentPrice'),
            }
    except (FileNotFoundError, json.JSONDecodeError):
        return {
            'valueAreaPairs': [],
            'entry': None,
            'sl': None,
            'tp1': None,
            'tp2': None,
            'currentPrice': None,
        }


def create_tradingview_style():
    return mpf.make_mpf_style(
        base_mpf_style='nightclouds',
        rc={
            'figure.facecolor': '#131722',
            'axes.facecolor': '#131722',
            'axes.edgecolor': '#363a45',
            'axes.labelcolor': '#d1d4dc',
            'xtick.color': '#d1d4dc',
            'ytick.color': '#d1d4dc',
            'grid.color': '#363a45',
            'grid.alpha': 0,
        },
        marketcolors={
            'candle': {'up': '#26a69a', 'down': '#ef5350'},
            'edge': {'up': '#26a69a', 'down': '#ef5350'},
            'wick': {'up': '#26a69a', 'down': '#ef5350'},
            'ohlc': {'up': '#26a69a', 'down': '#ef5350'},
            'volume': {'up': '#26a69a', 'down': '#ef5350'},
            'vcedge': {'up': '#26a69a', 'down': '#ef5350'},
            'vcdopcod': False,
            'alpha': 0.9,
        },
        gridstyle=':',
        y_on_right=True,
        gridaxis='',
    )


def create_chart(df, output_path, symbol, timeframe, trade_data=None):
    style = create_tradingview_style()
    
    title = f'{symbol} - {timeframe}'
    
    fig_size = (19.2, 10.8)
    dpi = 150
    
    hlines_dict = {}
    legend_patches = []
    
    value_area_pairs = trade_data.get('valueAreaPairs', []) if trade_data else []
    if value_area_pairs:
        colors = ['#FFD700', '#00BFFF', '#FF69B4', '#FFA500', '#00FF00', '#FF6347', '#9370DB', '#20B2AA']
        for i, pair in enumerate(value_area_pairs):
            color = colors[i % len(colors)]
            if 'vah' in pair:
                hlines_dict[pair['vah']] = color
            if 'val' in pair:
                hlines_dict[pair['val']] = color
            legend_patches.append(mpatches.Patch(color=color, label=f'Pair {i+1}'))
    
    entry = trade_data.get('entry') if trade_data else None
    sl = trade_data.get('sl') if trade_data else None
    tp1 = trade_data.get('tp1') if trade_data else None
    tp2 = trade_data.get('tp2') if trade_data else None
    
    if entry:
        legend_patches.append(mpatches.Patch(color='#FFD700', label=f'Entry: {entry}'))
    if sl:
        legend_patches.append(mpatches.Patch(color='#ef5350', label=f'SL: {sl}'))
    if tp1:
        legend_patches.append(mpatches.Patch(color='#26a69a', label=f'TP1: {tp1}'))
    if tp2:
        legend_patches.append(mpatches.Patch(color='#26a69a', label=f'TP2: {tp2}'))
    
    plot_kwargs = {
        'type': 'candle',
        'style': style,
        'title': title,
        'ylabel': 'Price',
        'figsize': fig_size,
        'volume': False,
        'returnfig': True,
        'scale_padding': dict(left=0.0, right=0.0, top=0.3, bottom=0.3),
    }
    
    if hlines_dict:
        plot_kwargs['hlines'] = dict(hlines=list(hlines_dict.keys()), colors=list(hlines_dict.values()), linestyle='--', linewidths=1.5)
    
    fig, axes = mpf.plot(df, **plot_kwargs)
    ax = axes[0]
    

    if entry and sl:
        y_min = min(entry, sl)
        y_max = max(entry, sl)
        ax.axhspan(y_min, y_max, alpha=0.2, color='#ef5350', zorder=0)
    
    if entry and tp2:
        y_min = min(entry, tp2)
        y_max = max(entry, tp2)
        ax.axhspan(y_min, y_max, alpha=0.25, color='#26a69a', zorder=0)
    
    if entry and tp1:
        y_min = min(entry, tp1)
        y_max = max(entry, tp1)
        ax.axhspan(y_min, y_max, alpha=0.15, color='#26a69a', zorder=0)
    
    if legend_patches:
        legend = ax.legend(handles=legend_patches, loc='upper left', facecolor='#131722', edgecolor='#363a45', labelcolor='#d1d4dc', fontsize=10)
        legend.get_frame().set_alpha(0.9)
    
    fig.savefig(output_path, dpi=dpi, facecolor='#131722', edgecolor='none', bbox_inches='tight')
    plt.close(fig)


def main():
    if len(sys.argv) != 2:
        print("Usage: python candlestick_chart.py <input_json_path>")
        sys.exit(1)
    
    input_path = sys.argv[1]
    
    if not os.path.exists(input_path):
        print(f"Error: Input file not found: {input_path}")
        sys.exit(1)
    
    try:
        data = load_json_data(input_path)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON file: {e}")
        sys.exit(1)
    
    if 'candles' not in data or not data['candles']:
        print("Error: No candle data found in JSON file")
        sys.exit(1)
    
    symbol = data.get('symbol', 'UNKNOWN')
    timeframe = data.get('timeframe', 'UNKNOWN')
    
    output_dir = Path('./idea')
    output_dir.mkdir(exist_ok=True)
    
    output_filename = f"{symbol}_{timeframe}.png"
    output_path = output_dir / output_filename
    
    df = prepare_dataframe(data)
    
    trade_data = load_trade_data()
    
    create_chart(df, str(output_path), symbol, timeframe, trade_data)
    
    print(f"Chart saved to: {output_path}")


if __name__ == '__main__':
    main()
