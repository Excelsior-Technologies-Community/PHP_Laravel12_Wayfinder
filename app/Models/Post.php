<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = [
        'title',
        'content',
        'featured',
    ];

    protected $casts = [
        'featured' => 'boolean',
    ];

    public function getWordCountAttribute(): int
    {
        if (!$this->content) {
            return 0;
        }

        return str_word_count(strip_tags($this->content));
    }

    public function getReadingTimeAttribute(): int
    {
        $words = $this->word_count;

        if ($words === 0) {
            return 0;
        }

        return max(1, (int) ceil($words / 200));
    }
}