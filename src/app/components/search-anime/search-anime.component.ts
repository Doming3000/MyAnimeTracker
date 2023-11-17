import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { AnimeService } from "src/app/services/anime.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-search-anime",
  templateUrl: "./search-anime.component.html",
  styleUrls: ["./search-anime.component.css"],
})
export class SearchAnimeComponent implements OnInit {
  @Output() searchClicked: EventEmitter<void> = new EventEmitter<void>();
  
  searchTerm: string = "";
  inputEmpty: boolean = false;
  searching: boolean = false;
  searchCompleted: boolean = false;
  searchButtonText: string = "Buscar";
  searchForm: FormGroup;
  
  constructor(private animeService: AnimeService, private formBuilder: FormBuilder) {
    this.searchForm = this.formBuilder.group({
      searchTerm: ["", Validators.required],
    });
  }
  
  ngOnInit(): void {}
  
  search() {
    if (this.searchTerm.trim() !== "") {
      this.searching = true;
      this.inputEmpty = false;
      this.searchCompleted = false;
      
      this.searchButtonText = "Buscando...";
      document.body.style.cursor = 'progress';
      
      this.animeService.getAnimes(this.searchTerm).subscribe((result) => {
        this.animeService.addResultAnime(result.data);
        this.searchTerm = "";
        this.searching = false;
        this.searchCompleted = true;
        this.searchClicked.emit();
        
        this.searchButtonText = "Buscar";
        document.body.style.cursor = 'default';
      });
    } else {
      this.inputEmpty = true;
      this.searchCompleted = false;
      
      const placeholder = document.querySelector(
        'input[name="search"]'
        ) as HTMLInputElement;
        placeholder.classList.add("shake-placeholder");
        
        setTimeout(() => {
          placeholder.classList.remove("shake-placeholder");
        }, 500);
      }
    }
  }