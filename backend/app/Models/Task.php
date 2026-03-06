<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Category;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        "title",
        "description",
        "due_date",
        "category_id",
        "project_id",
        "created_by"
    ];

    public function category() {
        return $this->belongsTo(Category::class);
    }

    public function project() {
        return $this->belongsTo(Project::class);
    }
}
